// EXAMPLE GAME FLOW

// import attack from './attack.js';
// import applyPotion from './apply_potion.js';
// import generateCharacters from './generate_characters.js';
// import showRecipeBook from './recipe_book.js';

// let characters;
// document.addEventListener('DOMContentLoaded', function () {
//     generateCharacters(difficulty)
//     .then(characters => {
//         characters = characters;
//         game();
//     })
// });

// function game() {
//     document.addEventListener('player click recipe book', function () {
//         showRecipeBook();
//     });
//     document.addEventListener('player drag potion to player', function () {
//         player = applyPotion(player, potion);
//     });
//     document.addEventListener('player drag potion to enemy', function () {
//         enemy = applyPotion(enemy, potion);
//     });
//     document.addEventListener('player clicked attack button', function () {
//         player, enemy = attack(player, enemy);
//         if (player.health <= 0) {
//             // game over
//         } else if (enemy.health <= 0) {
//             // game win / new game
//         }
//     });
// }