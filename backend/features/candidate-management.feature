Feature: Candidate Management
  As a recruiter
  I want to manage candidates in the ATS system
  So that I can track applicants efficiently

  Background:
    Given the ATS system is running
    And the database is accessible

  Scenario: Successfully add a new candidate with complete information
    Given I have candidate information:
      | firstName | John            |
      | lastName  | Doe             |
      | email     | john@example.com|
      | phone     | +1234567890     |
    When I submit the candidate form
    Then the candidate should be created successfully
    And the response should contain the candidate ID
    And the candidate should be stored in the database

  Scenario: Reject candidate with invalid email format
    Given I have candidate information with invalid email "invalid-email"
    When I submit the candidate form
    Then the request should be rejected with status 400
    And the error message should indicate "email" validation failure

  Scenario: Reject candidate with missing required fields
    Given I have incomplete candidate information:
      | firstName |      |
      | lastName  | Doe  |
      | email     |      |
      | phone     |      |
    When I submit the candidate form
    Then the request should be rejected with status 400
    And the error message should list all missing required fields

  Scenario: Prevent duplicate candidate emails
    Given a candidate with email "existing@example.com" already exists
    When I try to add another candidate with email "existing@example.com"
    Then the request should be rejected with status 409
    And the error message should indicate "already exists"

  Scenario: Add candidate with education history
    Given I have candidate information with education:
      | institution  | Harvard University |
      | degree       | Bachelor           |
      | fieldOfStudy | Computer Science   |
      | startDate    | 2015-09-01        |
      | endDate      | 2019-06-01        |
    When I submit the candidate form
    Then the candidate should be created successfully
    And the education history should be saved

  Scenario: Add candidate with work experience
    Given I have candidate information with experience:
      | company   | Google             |
      | position  | Software Engineer  |
      | startDate | 2019-07-01        |
      | current   | true              |
    When I submit the candidate form
    Then the candidate should be created successfully
    And the work experience should be saved

  Scenario: Upload candidate documents
    Given I have candidate information
    And I have a PDF resume file
    When I submit the candidate form with the document
    Then the candidate should be created successfully
    And the document should be uploaded
    And the document metadata should be stored

  Scenario: Reject invalid document types
    Given I have candidate information
    And I have an executable file
    When I submit the candidate form with the document
    Then the request should be rejected with status 400
    And the error message should indicate invalid file type

  Scenario: Reject oversized documents
    Given I have candidate information
    And I have a file larger than 5MB
    When I submit the candidate form with the document
    Then the request should be rejected with status 400
    And the error message should indicate file size limit

  Scenario: Retrieve list of candidates
    Given there are multiple candidates in the system
    When I request the candidate list
    Then I should receive a paginated list of candidates
    And each candidate should include basic information

  Scenario: Retrieve single candidate by ID
    Given a candidate with ID 123 exists
    When I request candidate with ID 123
    Then I should receive the complete candidate information
    And the response should include education history
    And the response should include work experience
    And the response should include documents

  Scenario: Handle non-existent candidate lookup
    When I request candidate with ID 999999
    Then the request should return status 404
    And the error message should indicate "not found"

  Scenario: Autocomplete institution names
    Given there are candidates with institutions:
      | Harvard University        |
      | Harvard Business School   |
      | Stanford University       |
    When I search for institutions with query "harv"
    Then I should receive suggestions containing "Harvard"
    And suggestions should be case-insensitive

  Scenario: Autocomplete company names
    Given there are candidates with companies:
      | Google Inc.      |
      | Google Cloud     |
      | Microsoft Corp.  |
    When I search for companies with query "goog"
    Then I should receive suggestions containing "Google"
    And suggestions should be limited to 10 results

  Scenario: Validate optional fields when provided
    Given I have candidate information with LinkedIn URL "invalid-url"
    When I submit the candidate form
    Then the request should be rejected with status 400
    And the error message should indicate LinkedIn URL validation failure

  Scenario: Handle current education status
    Given I have candidate information with education marked as "current"
    When I submit the candidate form
    Then the candidate should be created successfully
    And the education end date should be null

  Scenario: Handle current employment status
    Given I have candidate information with experience marked as "current"
    When I submit the candidate form
    Then the candidate should be created successfully
    And the experience end date should be null

  Scenario: Clean up uploaded files on validation failure
    Given I have candidate information with invalid email
    And I have a PDF resume file
    When I submit the candidate form with the document
    Then the request should be rejected
    And the uploaded file should be deleted from storage
    And no orphaned files should remain

  Scenario: Support pagination for candidate listing
    Given there are 25 candidates in the system
    When I request candidates with page 2 and limit 10
    Then I should receive 10 candidates
    And the pagination info should show page 2 of 3
    And the total count should be 25

