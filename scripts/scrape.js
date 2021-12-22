Array.from(games).map((game) => {
  const teams = game.querySelectorAll('.nfl-c-matchup-strip__team-fullname');
  return {
    start: game
      .querySelector('.nfl-c-matchup-strip__date-time')
      .textContent.trim(),
    away: teams[0].textContent.trim(),
    ome: teams[1].textContent.trim(),
  };
});
