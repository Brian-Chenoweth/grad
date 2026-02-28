export class ProjectTemplatePlugin {
  constructor() {}

  apply(hooks) {
    hooks.addFilter('possibleTemplatesList', 'faust', (templates, data) => {
      if (data?.seedNode?.__typename === 'Project') {
        return Array.from(new Set(['project', ...templates]));
      }
      if (data?.seedNode?.__typename === 'Program') {
        return Array.from(new Set(['program', ...templates]));
      }
      return templates;
    });
  }
}
