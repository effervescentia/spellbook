import path from 'node:path';

import fg from 'fast-glob';
import { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI) {
  plop.setGenerator('resource', {
    description: 'api resource boilerplate',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'resource name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'apps/api/src/{{kebabCase name}}/{{kebabCase name}}.controller.ts',
        templateFile: '.plop/resource/controller.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/{{kebabCase name}}/data/{{kebabCase name}}.db.ts',
        templateFile: '.plop/resource/db.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/{{kebabCase name}}/data/{{kebabCase name}}.dto.ts',
        templateFile: '.plop/resource/dto.hbs',
      },
      {
        type: 'modify',
        path: 'apps/api/src/db/db.schema.ts',
        pattern: /^(export {};\n)?/,
        template:
          "export * from '@api/{{kebabCase name}}/data/{{kebabCase name}}.db';\n",
      },
      {
        type: 'modify',
        path: 'apps/api/src/app/app.module.ts',
        pattern: /^/,
        template:
          "import { {{pascalCase name}}Controller } from '@api/{{kebabCase name}}/{{kebabCase name}}.controller';\n",
      },
      {
        type: 'append',
        path: 'apps/api/src/app/app.module.ts',
        pattern: /(?=;\s*$)/,
        template: '  .use({{pascalCase name}}Controller)',
      },
    ],
  });

  plop.setGenerator('service', {
    description: 'service boilerplate',
    prompts: async (inquirer) => {
      const { name } = await inquirer.prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'service name',
        },
      ]);

      const controllers = await fg.glob('**/*.controller.ts', {
        cwd: 'apps/api/src',
      });

      const { controller } = await inquirer.prompt<{ controller: string }>([
        {
          type: 'list',
          name: 'controller',
          message: 'inject service into this controller',
          choices: controllers,
        },
      ]);

      const folder = path.dirname(controller);

      return { name, controller, folder };
    },
    actions: [
      {
        type: 'add',
        path: 'apps/api/src/{{folder}}/{{kebabCase name}}.service.ts',
        templateFile: '.plop/service/service.hbs',
      },
      {
        type: 'modify',
        path: 'apps/api/src/{{controller}}',
        pattern: /^/,
        template:
          "import { {{pascalCase name}}Service } from '@api/{{folder}}/{{kebabCase name}}.service';\n",
      },
      {
        type: 'append',
        path: 'apps/api/src/{{controller}}',
        pattern: /Elysia.+}\)/g,
        template: '  .decorate({ service: new {{pascalCase name}}Service() })',
      },
    ],
  });

  plop.setGenerator('endpoint', {
    description: 'api endpoint boilerplate',
    prompts: async (inquirer) => {
      const controllers = await fg.glob('**/*.controller.ts', {
        cwd: path.join(__dirname, 'apps/api/src'),
      });

      const data = await inquirer.prompt<{
        controller: string;
        method: string;
        path: string;
      }>([
        {
          type: 'list',
          name: 'controller',
          message: 'inject service into this controller',
          choices: controllers,
        },
        {
          type: 'list',
          name: 'method',
          message: 'http method',
          choices: [
            'get',
            'put',
            'post',
            'head',
            'patch',
            'trace',
            'delete',
            'connect',
            'options',
          ],
        },
        {
          type: 'input',
          name: 'path',
          message: 'endpoint path',
          default: '/',
        },
      ]);

      return {
        ...data,
        path: data.path.startsWith('/') ? data.path : `/${data.path}`,
      };
    },
    actions: [
      {
        type: 'append',
        path: 'apps/api/src/{{controller}}',
        pattern: /(?=;\s*$)/,
        templateFile: '.plop/endpoint/controller.hbs',
      },
    ],
  });

  plop.setGenerator('dto', {
    description: 'dto boilerplate',
    prompts: async (inquirer) => {
      const modules = await fg.glob('*', {
        onlyDirectories: true,
        cwd: 'apps/api/src',
      });

      const { name } = await inquirer.prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'service name',
        },
      ]);

      if (!modules.includes(name)) {
        modules.push(name);
      }

      const data = await inquirer.prompt<{
        module: string;
        export: boolean;
      }>([
        {
          type: 'list',
          name: 'module',
          message: 'module name',
          default: name,
          choices: modules,
        },
        {
          type: 'confirm',
          name: 'export',
          message: 'export dto type',
          default: false,
        },
      ]);

      return { ...data, name };
    },
    actions: (data) =>
      [
        {
          type: 'add',
          path: 'apps/api/src/{{module}}/data/{{kebabCase name}}.dto.ts',
          templateFile: '.plop/dto/dto.hbs',
        },
        data?.export
          ? {
              type: 'modify',
              path: 'apps/api/src/app/app.interface.ts',
              pattern: /^(export {};\n)?/,
              template:
                // eslint-disable-next-line no-useless-escape
                "export type \{ {{pascalCase name}} } from '@api/{{module}}/data/{{kebabCase name}}.dto';\n",
            }
          : [],
      ].flat(),
  });

  plop.setGenerator('page', {
    description: 'web page boilerplate',
    prompts: async (inquirer) => {
      const { name } = await inquirer.prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'page name',
        },
      ]);

      const { route } = await inquirer.prompt<{ route: string }>([
        {
          type: 'input',
          name: 'route',
          message: 'page route',
          default: `/${name}`,
        },
      ]);

      if (!route.includes(':')) return { name, route };

      // split around route parameters like `:foo_id` or `:bar_id?`
      const parts = route.split(/(?=:\w+\??)|(?<=:\w+\??)(?![\w?])/);

      const { schema, factory, attrs, props, typedef } = parts.reduce(
        (acc, part) => {
          if (part.startsWith(':')) {
            const key = part.replaceAll(/[:?]/g, '');
            const isOptional = part.endsWith('?');

            acc.schema += `\n      ${key}: param.path${isOptional ? '.optional' : ''}.string,`;
            acc.factory += `$\{p.${key}}`;
            acc.attrs += ` ${key}={params.${key}}`;
            acc.typedef += `\n  ${key}${isOptional ? '?' : ''}: string;`;
            acc.props.push(key);
          } else {
            acc.factory += part;
          }

          return acc;
        },
        {
          schema: '',
          factory: '',
          attrs: '',
          props: [] as string[],
          typedef: '',
        },
      );

      const routeTemplate = `\n  {{camelCase name}}: defineRoute(
    {${schema}\n    },
    (p) => \`${factory}\`,
  ),`;

      const renderTemplate = `    .with({ name: '{{camelCase name}}' }, ({ params }) => <{{pascalCase name}}${attrs} />)\n\n`;

      return {
        name,
        route,
        propsDestruct: `{ ${props.join(', ')} }`,
        propsInterface: `{${typedef}\n}`,
        routeTemplate,
        renderTemplate,
        componentTemplateFile: '.plop/page/page-with-props.hbs',
      };
    },
    actions: (data) => [
      {
        type: 'add',
        path: 'apps/web/src/pages/{{kebabCase name}}/{{kebabCase name}}.page.tsx',
        templateFile: data?.componentTemplateFile ?? '.plop/page/page.hbs',
      },
      {
        type: 'append',
        path: 'apps/web/src/app/app.router.ts',
        pattern: /(?=}\);\s*$)/,
        template:
          data?.routeTemplate ??
          `  {{camelCase name}}: defineRoute('{{route}}'),\n`,
      },
      {
        type: 'modify',
        path: 'apps/web/src/app/app.component.tsx',
        pattern: /^/,
        template:
          "import { {{pascalCase name}} } from '@web/pages/{{kebabCase name}}/{{kebabCase name}}.page';\n",
      },
      {
        type: 'append',
        path: 'apps/web/src/app/app.component.tsx',
        pattern: /(?=\.otherwise\()/,
        template:
          data?.renderTemplate ??
          `    .with({ name: '{{camelCase name}}' }, () => <{{pascalCase name}} />)\n\n`,
      },
      {
        type: 'modify',
        path: 'apps/web/src/app/app.router.ts',
        transform: (text) => {
          const match = text.match(
            /(?<=import {)[^}]+(?=} from 'type-route';)/,
          );
          if (!match) {
            console.error('failed to inject imports into app.router.ts');
            return text;
          }

          const imports = match[0];

          const isMultiline = imports.includes('\n');
          const requiredImports = [
            'defineRoute',
            data?.routeTemplate ? 'param' : [],
          ].flat();
          const missingImports = requiredImports.filter(
            (name) => !imports.match(RegExp(`\\b${name}\\b`)),
          );

          if (!missingImports.length) return text;

          let transformed = imports.trim();
          for (const name of missingImports) {
            if (isMultiline) {
              transformed = `\n${transformed},\n  ${name}\n`;
            } else {
              transformed = ` ${transformed}, ${name} `;
            }
          }

          const matchIndex = match.index!;
          return `${text.slice(0, matchIndex)}${transformed}${text.slice(matchIndex + imports.length)}`;
        },
      },
    ],
  });

  plop.setGenerator('modal', {
    description: 'web modal boilerplate',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'modal name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'apps/web/src/modals/{{kebabCase name}}/{{kebabCase name}}.modal.tsx',
        templateFile: '.plop/modal/modal.hbs',
      },
    ],
  });
}
