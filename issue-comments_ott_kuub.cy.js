describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should add, edit, and delete a comment successfully', () => {
        //Add a comment
        const addedComment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...').click();

            cy.get('textarea[placeholder="Add a comment..."]').type(addedComment);

            cy.contains('button', 'Save')
                .click().should('not.exist');
        });

        //Assert that the comment has been added and is visible
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]').should('contain', addedComment);
        });

        //Edit the added comment
        const editedComment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first().contains('Edit')
                .click().should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', addedComment)
                .clear().type(editedComment);

            cy.contains('button', 'Save')
                .click().should('not.exist');
        });

        //Assert that the updated comment is visible
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit').and('contain', editedComment);
        });

        //Remove the comment
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete').click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click().should('not.exist');

        //Assert that the comment is removed
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            cy.wait(250).should('not.exist');
    });
});
