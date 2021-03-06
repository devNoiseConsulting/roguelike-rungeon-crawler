const React = require('react');

const PropTypes = require('prop-types');

const DungeonFactory = require('./DungeonFactory');
const Player = require('./Player');

const Dungeon = require('./Dungeon');
const PlayerInfo = require('./PlayerInfo');
const DungeonInfo = require('./DungeonInfo');

const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;

const Button = require('react-bootstrap').Button;

class App extends React.Component {
  constructor(props) {
    // Pass `props` into scope.
    super(props)

    // Get default state.
    this.getInitialState()
  }

  // Set default state.
  getInitialState() {
    this.state = {
      dungeonSize: 51,
      dungeonLevel: 1,
      dungeonWon: false,
      dungeons: [],
      player: new Player(25, 25)
    };

    return this.state;
  }

  componentDidMount() {
    let currentState = this.initializeDungeon(this.state);
    this.setState(currentState);

    window.addEventListener('keydown', this.handleKeypress.bind(this));
  }

  handleKeypress(e) {
    let dungeonFactory = new DungeonFactory();

    let keys = {
      'w': {
        'x': -1,
        'y': 0
      },
      'k': {
        'x': -1,
        'y': 0
      },
      'ArrowUp': {
        'x': -1,
        'y': 0
      },
      'a': {
        'x': 0,
        'y': -1
      },
      'h': {
        'x': 0,
        'y': -1
      },
      'ArrowLeft': {
        'x': 0,
        'y': -1
      },
      's': {
        'x': 1,
        'y': 0
      },
      'j': {
        'x': 1,
        'y': 0
      },
      'ArrowDown': {
        'x': 1,
        'y': 0
      },
      'd': {
        'x': 0,
        'y': 1
      },
      'l': {
        'x': 0,
        'y': 1
      },
      'ArrowRight': {
        'x': 0,
        'y': 1
      }
    };
    let currentState = this.state;
    let player = currentState.player;

    if (keys.hasOwnProperty(e.key) && player.alive) {
      let newX = player.x + keys[e.key].x;
      let newY = player.y + keys[e.key].y;
      let cell = currentState.dungeon[newX][newY];

      // Need to determine how to handle occupied cell
      // If wall do nothing.
      // If treasure, pick up and heal
      // If monter, fight
      if (cell == ' ') {
        currentState = dungeonFactory.movePlayer(currentState, newX, newY);
      } else {
        switch (cell.type) {
          case 'treasure':
            currentState = dungeonFactory.getLoot(currentState, newX, newY);
            break;
          case 'monster':
            console.log('monster', cell.kind, cell.attackLevel, cell.health);
            currentState = dungeonFactory.monsterFight(currentState, newX, newY);
            break;
          case 'ladder':
            currentState = this.initializeDungeon(currentState, false);
            break;
          default:
            // do nothing. Assuming a wall or other objet I haven't dealt with yet.
            break;
        }
      }

      this.setState(currentState);
    }
  }

  initializeDungeon(currentState, reset = true) {
    currentState = reset
      ? this.getInitialState()
      : currentState;
    currentState.dungeonLevel = reset
      ? currentState.dungeonLevel
      : currentState.dungeonLevel + 1;

    let dungeonFactory = new DungeonFactory();
    let dungeon = dungeonFactory.makeDungeon(currentState);
    currentState.dungeon = dungeon;

    return currentState;
  }

  resetGame() {
    console.log("resetGame");
    let resetState = this.getInitialState();
    resetState = this.initializeDungeon(resetState);
    this.setState(resetState);
  }

  continueGame() {
    console.log("continueGame");
    let player = this.state.player;
    player.alive = true;
    player.health = 100;
    this.setState({player: player});
  }

  render() {
    let player = this.state.player;
    let dungeon = this.state.dungeon;
    let dungeonWon = this.state.dungeonWon;
    let resetStyle = (dungeonWon)
      ? "primary"
      : "warning";
    let resetText = (dungeonWon)
      ? "New Game"
      : "Restart Game";
    let continueStatus = (player.alive)
      ? true
      : false;
    return (
      <Grid>
        <Row>
          <Col xs={12} md={6}>
            <Dungeon dungeon={dungeon} player={player} won={dungeonWon}/>
          </Col>
          <Col xs={12} md={6}>
            <DungeonInfo dungeonLevel={this.state.dungeonLevel} won={dungeonWon}/>
            <PlayerInfo player={player}/>
            <Row>
              <Col xs={12} md={6}>
                <Button bsStyle={resetStyle} bsSize="large" block onClick={this.resetGame}>{resetText}</Button>
              </Col>
              <Col xs={12} md={6}>
                <Button bsStyle="success" bsSize="large" disabled={continueStatus} block onClick={this.continueGame}>Continue</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }

}

module.exports = App;
