#!/usr/bin/env bash
# Scan a project directory for README-relevant facts and print them as JSON.
# Usage: scan_project.sh <project-dir>
#
# Best-effort, local-files-only detection (no network/API calls). Any fact
# that can't be found is emitted as an empty string or empty array — never
# invented. Written for portability across macOS (BSD tools, bash 3.2) and
# Linux (GNU tools): no bash 4+ features (associative arrays, mapfile),
# no GNU-only grep/sed flags, no jq/python/node dependency.

set -uo pipefail

EXCLUDED_NAMES=".git .agents .claude node_modules dist build"

usage() {
  echo "Usage: $0 <project-dir>" >&2
}

json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\t'/\\t}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/}"
  printf '%s' "$s"
}

json_array_from_text() {
  local text="$1"
  local out="[" first=1 line
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    if [ "$first" -eq 1 ]; then first=0; else out="$out,"; fi
    out="$out\"$(json_escape "$line")\""
  done <<< "$text"
  out="$out]"
  printf '%s' "$out"
}

extract_json_field() {
  # $1 = file, $2 = top-level string field name
  local file="$1" field="$2"
  [ -f "$file" ] || return 0
  grep -m1 -E "\"$field\"[[:space:]]*:[[:space:]]*\"" "$file" 2>/dev/null \
    | sed -E "s/.*\"$field\"[[:space:]]*:[[:space:]]*\"([^\"]*)\".*/\1/"
}

extract_toml_field() {
  # $1 = file, $2 = field name (name/description/license), first match wins
  local file="$1" field="$2"
  [ -f "$file" ] || return 0
  grep -m1 -E "^[[:space:]]*$field[[:space:]]*=[[:space:]]*\"" "$file" 2>/dev/null \
    | sed -E "s/^[[:space:]]*$field[[:space:]]*=[[:space:]]*\"([^\"]*)\".*/\1/"
}

extract_go_module() {
  local file="$1"
  [ -f "$file" ] || return 0
  grep -m1 -E '^module[[:space:]]+' "$file" 2>/dev/null | sed -E 's/^module[[:space:]]+//' | tr -d '\r'
}

detect_license_from_file() {
  local file="$1"
  [ -f "$file" ] || return 0
  if grep -qi "MIT License" "$file" 2>/dev/null; then printf 'MIT'; return; fi
  if grep -qi "Apache License" "$file" 2>/dev/null && grep -q "2\.0" "$file" 2>/dev/null; then printf 'Apache-2.0'; return; fi
  if grep -qi "GNU GENERAL PUBLIC LICENSE" "$file" 2>/dev/null; then
    if grep -q "Version 3" "$file" 2>/dev/null; then printf 'GPL-3.0'; return; fi
    if grep -q "Version 2" "$file" 2>/dev/null; then printf 'GPL-2.0'; return; fi
  fi
  if grep -qi "BSD 3-Clause" "$file" 2>/dev/null; then printf 'BSD-3-Clause'; return; fi
  if grep -qi "BSD 2-Clause" "$file" 2>/dev/null; then printf 'BSD-2-Clause'; return; fi
  if grep -qi "Mozilla Public License" "$file" 2>/dev/null; then printf 'MPL-2.0'; return; fi
  if grep -qi "ISC License" "$file" 2>/dev/null; then printf 'ISC'; return; fi
  printf ''
}

is_excluded_name() {
  local name="$1" ex
  case "$name" in
    .*) return 0 ;;
  esac
  for ex in $EXCLUDED_NAMES; do
    [ "$name" = "$ex" ] && return 0
  done
  return 1
}

list_level() {
  # $1 = dir, $2 = -type d|-type f -> newline-separated, excluded-filtered, sorted basenames
  local dir="$1" type_flag="$2" path base out=""
  while IFS= read -r path; do
    [ -z "$path" ] && continue
    base="$(basename "$path")"
    is_excluded_name "$base" && continue
    out="$out$base
"
  done < <(find "$dir" -mindepth 1 -maxdepth 1 $type_flag 2>/dev/null | sort)
  printf '%s' "$out"
}

build_tree() {
  local base="$1" top_dirs top_files d sub_dirs sub_files sd sf
  top_dirs="$(list_level "$base" -type\ d)"
  top_files="$(list_level "$base" -type\ f)"

  if [ -n "$top_dirs" ]; then
    while IFS= read -r d; do
      [ -z "$d" ] && continue
      printf '%s/\n' "$d"
      sub_dirs="$(list_level "$base/$d" -type\ d)"
      sub_files="$(list_level "$base/$d" -type\ f)"
      if [ -n "$sub_dirs" ]; then
        while IFS= read -r sd; do
          [ -z "$sd" ] && continue
          printf '  %s/\n' "$sd"
        done <<< "$sub_dirs"
      fi
      if [ -n "$sub_files" ]; then
        while IFS= read -r sf; do
          [ -z "$sf" ] && continue
          printf '  %s\n' "$sf"
        done <<< "$sub_files"
      fi
    done <<< "$top_dirs"
  fi

  if [ -n "$top_files" ]; then
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      printf '%s\n' "$f"
    done <<< "$top_files"
  fi
}

detect_package_manager() {
  local dir="$1"
  if   [ -f "$dir/pnpm-lock.yaml" ]; then printf 'pnpm'
  elif [ -f "$dir/yarn.lock" ]; then printf 'yarn'
  elif [ -f "$dir/package-lock.json" ]; then printf 'npm'
  elif [ -f "$dir/package.json" ]; then printf 'npm'
  elif [ -f "$dir/deno.lock" ] || [ -f "$dir/deno.json" ] || [ -f "$dir/deno.jsonc" ]; then printf 'deno'
  elif [ -f "$dir/go.sum" ] || [ -f "$dir/go.mod" ]; then printf 'go'
  elif [ -f "$dir/Cargo.lock" ] || [ -f "$dir/Cargo.toml" ]; then printf 'cargo'
  elif [ -f "$dir/poetry.lock" ] || [ -f "$dir/pyproject.toml" ] || [ -f "$dir/requirements.txt" ] || [ -f "$dir/Pipfile" ]; then printf 'pip'
  elif [ -f "$dir/build.gradle" ] || [ -f "$dir/build.gradle.kts" ] || [ -f "$dir/settings.gradle" ] || [ -f "$dir/settings.gradle.kts" ] || [ -f "$dir/gradlew" ]; then printf 'gradle'
  else printf ''
  fi
}

# --- main ---

if [ $# -lt 1 ]; then
  usage
  exit 1
fi

PROJECT_DIR_ARG="$1"
if [ ! -d "$PROJECT_DIR_ARG" ]; then
  echo "Error: not a directory: $PROJECT_DIR_ARG" >&2
  exit 1
fi
PROJECT_DIR="$(cd "$PROJECT_DIR_ARG" && pwd)"

name="" description="" license=""

# npm / deno (JSON manifests)
name="$(extract_json_field "$PROJECT_DIR/package.json" name)"
description="$(extract_json_field "$PROJECT_DIR/package.json" description)"
license="$(extract_json_field "$PROJECT_DIR/package.json" license)"

if [ -z "$name" ]; then name="$(extract_json_field "$PROJECT_DIR/deno.json" name)"; fi
if [ -z "$description" ]; then description="$(extract_json_field "$PROJECT_DIR/deno.json" description)"; fi

# pyproject.toml
if [ -z "$name" ]; then name="$(extract_toml_field "$PROJECT_DIR/pyproject.toml" name)"; fi
if [ -z "$description" ]; then description="$(extract_toml_field "$PROJECT_DIR/pyproject.toml" description)"; fi
if [ -z "$license" ]; then license="$(extract_toml_field "$PROJECT_DIR/pyproject.toml" license)"; fi

# Cargo.toml
if [ -z "$name" ]; then name="$(extract_toml_field "$PROJECT_DIR/Cargo.toml" name)"; fi
if [ -z "$description" ]; then description="$(extract_toml_field "$PROJECT_DIR/Cargo.toml" description)"; fi
if [ -z "$license" ]; then license="$(extract_toml_field "$PROJECT_DIR/Cargo.toml" license)"; fi

# go.mod
go_module=""
if [ -f "$PROJECT_DIR/go.mod" ]; then
  go_module="$(extract_go_module "$PROJECT_DIR/go.mod")"
  if [ -z "$name" ] && [ -n "$go_module" ]; then name="${go_module##*/}"; fi
fi

# gradle (rootProject.name)
if [ -z "$name" ]; then
  for gf in settings.gradle settings.gradle.kts; do
    if [ -f "$PROJECT_DIR/$gf" ]; then
      gname="$(grep -m1 -E "rootProject\.name[[:space:]]*=" "$PROJECT_DIR/$gf" 2>/dev/null \
        | sed -E "s/.*rootProject\.name[[:space:]]*=[[:space:]]*['\"]([^'\"]*)['\"].*/\1/")"
      [ -n "$gname" ] && name="$gname"
      break
    fi
  done
fi

# license fallback: sniff LICENSE file contents
if [ -z "$license" ]; then
  for lf in LICENSE LICENSE.md LICENSE.txt; do
    if [ -f "$PROJECT_DIR/$lf" ]; then
      license="$(detect_license_from_file "$PROJECT_DIR/$lf")"
      [ -n "$license" ] && break
    fi
  done
fi

# git remote -> owner/repo
owner="" repo=""
if command -v git >/dev/null 2>&1; then
  remote_url="$(git -C "$PROJECT_DIR" remote get-url origin 2>/dev/null || true)"
  if [ -n "$remote_url" ]; then
    clean="${remote_url%.git}"
    owner_repo="$(printf '%s' "$clean" | sed -E 's#.*[:/]([^/]+)/([^/]+)$#\1/\2#')"
    case "$owner_repo" in
      */*) owner="${owner_repo%%/*}"; repo="${owner_repo##*/}" ;;
    esac
  fi
fi

# fallback owner/repo from a github.com go module path
if [ -z "$owner" ] && [ -n "$go_module" ]; then
  case "$go_module" in
    github.com/*)
      rest="${go_module#github.com/}"
      owner="$(printf '%s' "$rest" | cut -d/ -f1)"
      repo="$(printf '%s' "$rest" | cut -d/ -f2)"
      ;;
  esac
fi

pkg_manager="$(detect_package_manager "$PROJECT_DIR")"

# CI setup
ci_type="" ci_files_text=""
if [ -d "$PROJECT_DIR/.github/workflows" ]; then
  ci_type="github-actions"
  ci_files_text="$(find "$PROJECT_DIR/.github/workflows" -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) 2>/dev/null \
    | sort \
    | while IFS= read -r wf; do basename "$wf"; done)"
elif [ -f "$PROJECT_DIR/.gitlab-ci.yml" ]; then
  ci_type="gitlab-ci"
  ci_files_text=".gitlab-ci.yml"
elif [ -f "$PROJECT_DIR/.circleci/config.yml" ]; then
  ci_type="circleci"
  ci_files_text=".circleci/config.yml"
fi

# social links: scan local files for known-platform URLs (no API calls)
social_pattern='https?://[^" <>)]*(twitter\.com|x\.com|discord\.gg|discord\.com|youtube\.com|linkedin\.com|bsky\.app|twitch\.tv)[^" <>)]*'
social_text=""
for f in "$PROJECT_DIR/package.json" "$PROJECT_DIR/deno.json" "$PROJECT_DIR/README.md" \
         "$PROJECT_DIR/Readme.md" "$PROJECT_DIR/README.markdown" "$PROJECT_DIR/CONTRIBUTING.md"; do
  [ -f "$f" ] || continue
  found="$(grep -oE "$social_pattern" "$f" 2>/dev/null || true)"
  [ -n "$found" ] && social_text="$social_text
$found"
done
if [ -n "$social_text" ]; then
  social_text="$(printf '%s\n' "$social_text" | sed '/^$/d' | sort -u)"
fi

tree_text="$(build_tree "$PROJECT_DIR")"

ci_files_json="$(json_array_from_text "$ci_files_text")"
social_links_json="$(json_array_from_text "$social_text")"
directory_structure_json="$(json_array_from_text "$tree_text")"

cat <<JSON
{
  "name": "$(json_escape "$name")",
  "description": "$(json_escape "$description")",
  "license": "$(json_escape "$license")",
  "git_remote": {
    "owner": "$(json_escape "$owner")",
    "repo": "$(json_escape "$repo")"
  },
  "package_manager": "$(json_escape "$pkg_manager")",
  "ci": {
    "type": "$(json_escape "$ci_type")",
    "workflow_files": $ci_files_json
  },
  "social_links": $social_links_json,
  "directory_structure": $directory_structure_json
}
JSON
