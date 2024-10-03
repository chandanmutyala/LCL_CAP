using {com.cy.localisation as local} from '../db/schema';


service LocalisationService {
    entity ScopeItems        as projection on local.ScopeItems;
    entity MissingScopeItems as projection on local.MissingScopeItems;
    entity DropdownValues    as projection on local.DropdownValues;
    entity LOB               as projection on local.LOB;
    entity BusinessArea      as projection on local.BusinessArea;
    entity countries         as projection on local.countries;
    
    action   resetAndInsertScopeItems(items : many ScopeItems);

    type ScopeItemType {
        ScopeItemID  : String;
        Description  : String;
        LOB          : String;
        BusinessArea : String;
        Status       : String;
    }

    type UniqueValue {
        keey: String;
        text: String;
    }

    function getUniqueValues(column: String) returns array of UniqueValue;

    function getUniqueValuesRms(column: String) returns array of UniqueValue;


    function deleteAllScopeItems() returns {
        message: String
    };
    


    //function getUniqueScopeItems() returns ScopeItemType;
      // function getUniqueValues(column: String) returns array of String;
}
