#!/usr/bin/env bash
# Validates that packages/<name> was scaffolded correctly by the
# new-internal-pkg skill (see ../assets/structure-template.md).
#
# Usage: create-new-package.sh <package-name>
#   package-name: kebab-case, without the @repo/ prefix (e.g. facturacion)

set -euo pipefail

PACKAGE_NAME="${1:-}"
if [[ -z "$PACKAGE_NAME" ]]; then
  echo "Usage: $0 <package-name>" >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)")"
PKG_DIR="$REPO_ROOT/packages/$PACKAGE_NAME"
PKG_JSON="$PKG_DIR/package.json"
TSCONFIG="$PKG_DIR/tsconfig.json"
INDEX_TS="$PKG_DIR/src/index.ts"
EXPECTED_NAME="@repo/$PACKAGE_NAME"

FAILURES=0

pass() { echo "  OK   $1"; }
fail() { echo "  FAIL $1"; FAILURES=$((FAILURES + 1)); }

echo "Validating packages/$PACKAGE_NAME ..."

# --- Structure ---------------------------------------------------------
[[ -d "$PKG_DIR" ]] && pass "directory exists" || { fail "directory missing: $PKG_DIR"; }
[[ -f "$PKG_JSON" ]] && pass "package.json exists" || fail "package.json missing"
[[ -f "$TSCONFIG" ]] && pass "tsconfig.json exists" || fail "tsconfig.json missing"
[[ -f "$INDEX_TS" ]] && pass "src/index.ts exists" || fail "src/index.ts missing"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq not found — skipping JSON field checks." >&2
else
  # --- package.json fields ---------------------------------------------
  if [[ -f "$PKG_JSON" ]]; then
    if jq empty "$PKG_JSON" >/dev/null 2>&1; then
      pass "package.json is valid JSON"

      NAME=$(jq -r '.name // empty' "$PKG_JSON")
      [[ "$NAME" == "$EXPECTED_NAME" ]] \
        && pass "package.json name is $EXPECTED_NAME" \
        || fail "package.json name is '$NAME', expected '$EXPECTED_NAME'"

      [[ "$(jq -r '.private // empty' "$PKG_JSON")" == "true" ]] \
        && pass "package.json is private" \
        || fail "package.json missing \"private\": true"

      TYPES_EXPORT=$(jq -r '.exports["."].types // empty' "$PKG_JSON")
      DEFAULT_EXPORT=$(jq -r '.exports["."].default // empty' "$PKG_JSON")
      [[ "$TYPES_EXPORT" == "./src/index.ts" ]] \
        && pass "exports.\".\".types points to ./src/index.ts" \
        || fail "exports.\".\".types is '$TYPES_EXPORT', expected './src/index.ts'"
      [[ -n "$DEFAULT_EXPORT" ]] \
        && pass "exports.\".\".default is set ($DEFAULT_EXPORT)" \
        || fail "exports.\".\".default is missing"

      for script in dev build check-types; do
        [[ "$(jq -r --arg s "$script" '.scripts[$s] // empty' "$PKG_JSON")" != "" ]] \
          && pass "scripts.$script is set" \
          || fail "scripts.$script is missing"
      done

      [[ "$(jq -r '.devDependencies["@repo/typescript-config"] // empty' "$PKG_JSON")" == "workspace:*" ]] \
        && pass "devDependencies has @repo/typescript-config as workspace:*" \
        || fail "devDependencies.@repo/typescript-config is missing or not workspace:*"
    else
      fail "package.json is not valid JSON"
    fi
  fi

  # --- tsconfig.json fields ---------------------------------------------
  if [[ -f "$TSCONFIG" ]]; then
    if jq empty "$TSCONFIG" >/dev/null 2>&1; then
      pass "tsconfig.json is valid JSON"

      [[ "$(jq -r '.extends // empty' "$TSCONFIG")" == "@repo/typescript-config/base.json" ]] \
        && pass "tsconfig.json extends @repo/typescript-config/base.json" \
        || fail "tsconfig.json does not extend @repo/typescript-config/base.json"

      OUT_DIR=$(jq -r '.compilerOptions.outDir // empty' "$TSCONFIG")
      ROOT_DIR=$(jq -r '.compilerOptions.rootDir // empty' "$TSCONFIG")
      [[ "$OUT_DIR" == "dist" ]] && pass "compilerOptions.outDir is dist" || fail "compilerOptions.outDir is '$OUT_DIR', expected 'dist'"
      [[ "$ROOT_DIR" == "src" ]] && pass "compilerOptions.rootDir is src" || fail "compilerOptions.rootDir is '$ROOT_DIR', expected 'src'"

      [[ "$(jq -c '.include // empty' "$TSCONFIG")" != "" && "$(jq -c '.include // empty' "$TSCONFIG")" != "null" ]] \
        && pass "include is set" \
        || fail "include is missing (not inherited from base config)"
      [[ "$(jq -c '.exclude // empty' "$TSCONFIG")" != "" && "$(jq -c '.exclude // empty' "$TSCONFIG")" != "null" ]] \
        && pass "exclude is set" \
        || fail "exclude is missing (not inherited from base config)"

      # exports.default should resolve under outDir once built (dist/index.js)
      if [[ -f "$PKG_JSON" ]] && jq empty "$PKG_JSON" >/dev/null 2>&1; then
        DEFAULT_EXPORT=$(jq -r '.exports["."].default // empty' "$PKG_JSON")
        EXPECTED_DEFAULT="./$OUT_DIR/index.js"
        [[ "$DEFAULT_EXPORT" == "$EXPECTED_DEFAULT" ]] \
          && pass "exports.\".\".default matches outDir ($EXPECTED_DEFAULT)" \
          || fail "exports.\".\".default is '$DEFAULT_EXPORT', expected '$EXPECTED_DEFAULT' to match outDir"
      fi
    else
      fail "tsconfig.json is not valid JSON"
    fi
  fi
fi

# --- Workspace registration ---------------------------------------------
if command -v pnpm >/dev/null 2>&1; then
  if (cd "$REPO_ROOT" && pnpm list -r --depth -1 --json 2>/dev/null | jq -e --arg n "$EXPECTED_NAME" 'any(.[]; .name == $n)' >/dev/null 2>&1); then
    pass "pnpm workspace recognizes $EXPECTED_NAME (run 'pnpm install' if this just failed)"
  else
    fail "pnpm workspace does not recognize $EXPECTED_NAME — run 'pnpm install' from repo root"
  fi
else
  echo "pnpm not found — skipping workspace registration check." >&2
fi

# --- Type check -----------------------------------------------------------
if command -v pnpm >/dev/null 2>&1 && [[ -f "$PKG_JSON" ]]; then
  echo "Running check-types ..."
  if (cd "$REPO_ROOT" && pnpm --filter "$EXPECTED_NAME" check-types >/tmp/create-new-package-check-types.log 2>&1); then
    pass "pnpm --filter $EXPECTED_NAME check-types passed"
  else
    fail "pnpm --filter $EXPECTED_NAME check-types failed (see /tmp/create-new-package-check-types.log)"
    sed 's/^/       /' /tmp/create-new-package-check-types.log
  fi
fi

echo ""
if [[ "$FAILURES" -eq 0 ]]; then
  echo "packages/$PACKAGE_NAME looks correctly scaffolded."
  exit 0
else
  echo "$FAILURES check(s) failed for packages/$PACKAGE_NAME."
  exit 1
fi
