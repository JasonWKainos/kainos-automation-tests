Feature: Kainos Website Header Verification
  As a QA tester
  I want to verify the header elements on kainos.com
  So that I can ensure the navigation and branding are working correctly

  Background:
    Given I navigate to the Kainos homepage
    And I accept the cookie consent

  Scenario: Verify logo presence and functionality
    Then the Kainos logo should be visible
    And the logo should contain the correct image source
    And the logo should link to the homepage

  Scenario: Verify main navigation menu items
    Then the following navigation items should be visible:
      | Navigation Item  | URL                                    |
      | Digital Services | /digital-services                      |
      | Workday          | /workday                               |
      | Industries       | /industries                            |
      | Insights         | /insights                              |
      | Careers          | https://careers.kainos.com/gb/en       |

  Scenario: Verify right-side header elements
    Then the "Share icons" button should be visible
    And the "Get in touch" link should be visible
    And the "Get in touch" link should point to "/contact-us"
    And the "Search" button should be visible

  Scenario: Verify Digital Services dropdown menu
    When I hover over the "Digital Services" navigation item
    Then the following services should be visible in the dropdown:
      | Service                |
      | Digital Advisory       |
      | Cloud and engineering  |
      | Data and AI            |
      | AI Business Solutions  |
      | User-centred design    |
      | Managed services       |
    And the following impacts should be visible in the dropdown:
      | Impact                              |
      | Building digital transformation     |
      | Driving continuous improvement      |
      | Improving business performance      |
      | Improving customer engagement       |

  Scenario: Verify navigation item functionality
    When I click on the "Digital Services" navigation item
    Then I should be navigated to "/digital-services"
    And the page title should contain "Digital Services"

  Scenario: Verify header accessibility
    Then all navigation links should be keyboard accessible
    And the header should have proper ARIA landmarks

  Scenario Outline: Verify individual navigation links
    When I click on the "<Navigation Item>" link
    Then I should be navigated to "<URL>"

    Examples:
      | Navigation Item  | URL               |
      | Digital Services | /digital-services |
      | Workday          | /workday          |
      | Industries       | /industries       |
      | Insights         | /insights         |
