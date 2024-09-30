using {com.cy.localisation as local} from '../db/schema';



service LocalisationService {
    entity ScopeItems as projection on local.ScopeItems;
    entity MissingScopeItems as projection on local.MissingScopeItems;
    entity DropdownValues as projection on local.DropdownValues;
    entity LOB as projection on local.LOB;
    entity BusinessArea as projection on local.BusinessArea;
    entity countries as projection on local.countries;
}