@isTest
public with sharing class DynamicDataTableHelper_Test {
  @istest
  static void testMethod1() {
    Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];
    User u = new User(
      Alias = 'testUyr',
      Email = 'testuser11_test22@testorg.com',
      EmailEncodingKey = 'UTF-8',
      LastName = 'Testing',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      ProfileId = p.Id,
      TimeZoneSidKey = 'America/Los_Angeles',
      UserName = 'testuser11_test22@testorg.com'
    );

    insert u;
    Account acc = new Account(Name = 'TestAccount');
    insert acc;

    Test.startTest();
    DynamicDataTableHelper.getDatableInfo('Account', 'Name,Id,Owner.Name');
    Test.stopTest();
  }
}