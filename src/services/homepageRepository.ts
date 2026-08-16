import { HomepageSpotlight, EditorialStory } from '../types';

export class HomepageRepository {
  public getPublishedSpotlights(): HomepageSpotlight[] {
    // Honest temporary configuration. No backend CRUD source exists yet.
    // Returning an empty array to render the integration state.
    return [];
  }

  public getPublishedStories(): EditorialStory[] {
    // Honest temporary configuration. No editorial repository exists yet.
    // Returning an empty array to render the integration state.
    return [];
  }
}

export const homepageRepository = new HomepageRepository();
