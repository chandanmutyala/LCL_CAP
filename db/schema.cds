namespace com.cy.localisation;

//using {cuid} from '@sap/cds/common';


entity ScopeItems {
  key autoID        : Integer;
      ScopeItemID   : String; // Adjust the length as per your requirement
      Description   : String; // Adjust the length as per your requirement
      LOB           : String; // Line of Business
      BusinessArea  : String;
      Status        : String;
      // Country columns
      AE            : String(20); // United Arab Emirates (AE)
      AR            : String(20); // Argentina (AR)
      AT            : String(20); // Austria (AT)
      AU            : String(20); // Australia (AU)
      BE            : String(20); // Belgium (BE)
      BG            : String(20); // Bulgaria (BG)
      BR            : String(20); // Brazil (BR)
      CA            : String(20); // Canada (CA)
      CH            : String(20); // Switzerland (CH)
      CL            : String(20); // Chile (CL)
      CN            : String(20); // China (CN)
      CO            : String(20); // Colombia (CO)
      CZ            : String(20); // Czech Republic (CZ)
      DE            : String(20); // Germany (DE)
      DK            : String(20); // Denmark (DK)
      EG            : String(20); // Egypt (EG)
      ES            : String(20); // Spain (ES)
      FI            : String(20); // Finland (FI)
      FR            : String(20); // France (FR)
      GB            : String(20); // United Kingdom (GB)
      GR            : String(20); // Greece (GR)
      HK            : String(20); // Hong Kong (HK)
      HR            : String(20); // Croatia (HR)
      HU            : String(20); // Hungary (HU)
      ID            : String(20); // Indonesia (ID)
      IE            : String(20); // Ireland (IE)
      IL            : String(20); // Israel (IL)
      IND           : String(20); // India (IND)
      IT            : String(20); // Italy (IT)
      JP            : String(20); // Japan (JP)
      KR            : String(20); // South Korea (KR)
      KW            : String(20); // Kuwait (KW)
      KZ            : String(20); // Kazakhstan (KZ)
      LU            : String(20); // Luxembourg (LU)
      MX            : String(20); // Mexico (MX)
      MY            : String(20); // Malaysia (MY)
      NL            : String(20); // Netherlands (NL)
      NR            : String(20); // Norway (NR)
      NZ            : String(20); // New Zealand (NZ)
      OM            : String(20); // Oman (OM)
      PE            : String(20); // Peru (PE)
      PH            : String(20); // Philippines (PH)
      PL            : String(20); // Poland (PL)
      PT            : String(20); // Portugal (PT)
      QA            : String(20); // Qatar (QA)
      RO            : String(20); // Romania (RO)
      RS            : String(20); // Serbia (RS)
      RU            : String(20); // Russia (RU)
      SA            : String(20); // Saudi Arabia (SA)
      SE            : String(20); // Sweden (SE)
      SG            : String(20); // Singapore (SG)
      SI            : String(20); // Slovenia (SI)
      SK            : String(20); // Slovakia (SK)
      TH            : String(20); // Thailand (TH)
      TR            : String(20); // Turkey (TR)
      TW            : String(20); // Taiwan (TW)
      UA            : String(20); // Ukraine (UA)
      US            : String(20); // United States (US)
      ZA            : String(20); // South Africa (ZA)
      Non_Localised : String(20); // Non-Localised
}


entity MissingScopeItems {
  key autoId             : Integer;
      customerOrProspect : String;
      customerName       : String;
      brandGuardianStatus : String ;
      globalServicesStatus : String ;
      oppurtunityNumber  : String;
      
      priority           : String; //low or medium or high
      goLiveDate         : Date;
      revenue            : String;
      country            : String; //  multiple country selector
      industry           : String; //  multiple industry selector
      createdBy          : String default 'Nywald';
      createdOn          : Date @cds.on.insert: $now;
      ScopeItemID        : String; // Adjust the length as per your requirement
      Description        : String; // Adjust the length as per your requirement
      LOB                : String; // Line of Business
      BusinessArea       : String;

}



// In your service definition (e.g., `srv/Service.cds`)
entity DropdownValues {
    key name: String;
    Text: String;
}