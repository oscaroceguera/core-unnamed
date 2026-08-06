import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("package", {
    description: "Create a new shared packages",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new package to create?",
        validate: (input: string) => {
          if (!input) {
            return "file name is required";
          }
          return true;
        }
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/tsconfig.json",
        templateFile: 'templates/package/tsconfig.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/README.md",
        templateFile: 'templates/package/README.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/package.json",
        templateFile: 'templates/package/package.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/src/index.ts",
        templateFile: 'templates/package/index.hbs'
      }
    ]
  });

  plop.setGenerator("theme", {
    description: "Create a new theme shared packages",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new theme package to create?",
        validate: (input: string) => {
          if (!input) {
            return "file name is required";
          }
          return true;
        }
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/packages/{{kebabCase name}}",
        base: 'templates/theme',
        templateFiles: 'templates/theme/**'

      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/package.json",
        templateFile: 'templates/package/theme-package.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/README.md",
        templateFile: 'templates/package/theme-readme.hbs'
      },
    ]
  });

  plop.setGenerator("mock-data", {
    description: "Create a new mock data shared packages",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new mock data package to create?",
        validate: (input: string) => {
          if (!input) {
            return "file name is required";
          }
          return true;
        }
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/packages/{{kebabCase name}}",
        base: 'templates/mock-data',
        templateFiles: 'templates/mock-data/**'

      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/package.json",
        templateFile: 'templates/package/mock-data-package.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/README.md",
        templateFile: 'templates/package/mock-data-readme.hbs'
      },
    ]
  });

  plop.setGenerator("ui", {
    description: "Create a new ui data shared packages",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new ui data package to create?",
        validate: (input: string) => {
          if (!input) {
            return "file name is required";
          }
          return true;
        }
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/packages/{{kebabCase name}}",
        base: 'templates/ui',
        templateFiles: 'templates/ui/**'

      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/package.json",
        templateFile: 'templates/package/ui-package.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{kebabCase name}}/README.md",
        templateFile: 'templates/package/ui-readme.hbs'
      },
    ]
  });
}
