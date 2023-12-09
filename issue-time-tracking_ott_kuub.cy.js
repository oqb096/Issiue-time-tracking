describe('Time Estimation and Logging Functionality', () => {
    const selectors = {
        issueDetailsModal: '[data-testid="modal:issue-details"]',
        timeLoggingButton: '[data-testid="icon:stopwatch"]',
        trackingModal: '[data-testid="modal:tracking"]',
        numberInput: 'input[placeholder="Number"]',
        logTimeButton: '[data-testid="button:log-time"]',
        doneButton: '[data-testid="button:done"]',
        timeLogDisplay: '[data-testid="time-log"]',
    };

    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task').click();
            cy.get(selectors.issueDetailsModal).should('be.visible');
        });
    });

    it('Time Estimation and Logging Functionality', () => {
        // Time Estimation
        const value = '10';
        const newValue = '20';

        cy.get(selectors.issueDetailsModal).within(() => {
            cy.get(selectors.numberInput).clear().type(value);
            cy.contains(`${value}h estimated`).should('be.visible');

            cy.get(selectors.numberInput).clear().type(newValue);
            cy.contains(`${newValue}h estimated`).should('be.visible');

            cy.get(selectors.numberInput).clear();
            cy.contains(`${newValue}h estimated`).should('not.exist');
        });

        // Time Logging
        const timeSpent = '2h';
        const timeRemaining = '5h';

        cy.get(selectors.timeLoggingButton).click();
        cy.get(selectors.trackingModal).should('be.visible').within(() => {
            cy.get(selectors.numberInput).first().clear().type(timeSpent);
            cy.get(selectors.numberInput).last().clear().type(timeRemaining);
            cy.get(selectors.logTimeButton).click();
        });

        // Assert that the time log is added and visible
        cy.get(selectors.issueDetailsModal).should('be.visible').within(() => {
            cy.get(selectors.timeLogDisplay).should('contain', timeSpent).and('contain', timeRemaining);
        });

        // Edit the time log
        const updatedTimeSpent = '1h';
        const updatedTimeRemaining = '3h';

        cy.get(selectors.trackingModal).contains('button', 'Edit').click();
        cy.get(selectors.trackingModal).within(() => {
            cy.get(selectors.numberInput).first().clear().type(updatedTimeSpent);
            cy.get(selectors.numberInput).last().clear().type(updatedTimeRemaining);
            cy.get(selectors.doneButton).click();
        });

        // Assert that the updated time log is visible
        cy.get(selectors.issueDetailsModal).should('be.visible').within(() => {
            cy.get(selectors.timeLogDisplay).should('contain', updatedTimeSpent).and('contain', updatedTimeRemaining);
        });

        // Remove the time log
        cy.get(selectors.trackingModal).contains('button', 'Delete').click();
        cy.get(selectors.trackingModal).contains('button', 'Delete Log').click();

        // Assert that the time log is removed
        cy.get(selectors.issueDetailsModal).should('be.visible').and('not.contain', selectors.timeLogDisplay);
    });
});
