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
      if (
        (data?.seedNode?.__typename === 'ContentType' ||
          data?.seedNode?.__typename === 'Page') &&
        (data?.seedNode?.uri === '/programs/' ||
          data?.seedNode?.uri === '/programs')
      ) {
        return Array.from(new Set(['programs', ...templates]));
      }
      return templates;
    });
  }
}
