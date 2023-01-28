import { countries } from 'src/app/utils/countries';
import { AcquisitionDestinationMap, AcquisitionNatureMap, AcquisitionStateMap, ConstructionNormStringMap, ProjectStateMap } from 'src/app/utils/strings';

export class Project {

  countries = countries;
  constructor() { }

  projectStateToString(state) {
    return ProjectStateMap.toString(state);
  }

  constructionNormToString(state) {
    return ConstructionNormStringMap.toString(state);
  }

}
