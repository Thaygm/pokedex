/// <reference types="cypress" />

describe('Página Principal - Testes Básicos', () => {
    beforeEach(() => {
        cy.visit('/'); 
    });

    it('deve exibir o título Favoritos e o botão de limpar favoritos', () => {
        cy.get('.favorites-header h2').should('contain', 'Favoritos');
        cy.get('.clear-favorites').should('be.visible');
    });

    it('deve exibir a mensagem "Nenhum favorito ainda" quando não há favoritos', () => {
        cy.get('.favorites-list').should('contain', 'Nenhum favorito ainda.');
    });

    it('deve permitir buscar por Pokémon usando o campo de busca', () => {
        cy.get('input[placeholder="Buscar por nome ou número o Pokémon"]')
            .type('Pikachu');
        cy.get('.pokemon-list').should('exist');
        cy.get('.pokemon-card', { timeout: 10000 })
            .should('have.length.greaterThan', 0)
            .then(cards => {
                cards.each((index, card) => {
                    cy.wrap(card).invoke('text').then(text => {
                        console.log(`Card ${index}: ${text}`);
                    });
            });
                const hasPikachu = Array.from(cards).some(card =>
                    card.innerText.toLowerCase().includes('pikachu')
            );
                expect(hasPikachu).to.be.true;
            });
    });

    it('deve navegar entre páginas de Pokémons', () => {
        cy.get('.pokemon-card h3').then(($pokemonFirstPage) => {
            const firstPagePokemon = [...$pokemonFirstPage].map(pokemon => pokemon.innerText);
            cy.get('.pagination-controls').within(() => {
                cy.get('.next-button').click();
            });
            cy.get('.pokemon-card h3', { timeout: 10000 }).should(($pokemonSecondPage) => {
            const secondPagePokemon = [...$pokemonSecondPage].map(pokemon => pokemon.innerText);
                expect(firstPagePokemon).to.not.deep.equal(secondPagePokemon);
            });
        });
    });
    
    it('deve permitir adicionar e remover Pokémon dos favoritos', () => {
        cy.get('.pokemon-list .pokemon-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
        cy.get('.pokemon-list .pokemon-card').first().within(() => {
            cy.get('.favorite-button').click({ force: true });
        });
        cy.get('.favorites-list').should('not.contain', 'Nenhum favorito ainda');
        cy.get('.clear-favorites').click({ force: true });
        cy.get('.favorites-list').should('contain', 'Nenhum favorito ainda');
    });

    it('deve permitir acessar a página de detalhamento do Pokémon ao clicar no card', () => {
        cy.get('.pokemon-list .pokemon-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
        cy.get('.pokemon-list .pokemon-card').first().click({ force: true });
        cy.url().should('include', '/pokemon/');
    });
});