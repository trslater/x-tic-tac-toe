import React, { useState } from 'react';
import styled from 'styled-components'
import 'styled-components/macro'


// Data / config
// -------------

const squareSize = 100
const startingBoards = { x: 0, y: 0 }
const winningBoards = [
  0b111000000,
  0b000111000,
  0b000000111,
  0b100100100,
  0b010010010,
  0b001001001,
  0b100010001,
  0b001010100,
]

const App = () => {

  // State
  // -----

  const [playing, setPlaying] = useState(true)
  const [boards, setBoards] = useState(startingBoards)
  const [player, setPlayer] = useState('x')
  const [winner, setWinner] = useState()


  // Generate Stuff
  // --------------

  const squares = getSquares(boards)


  // Actions
  // -------

  const attemptTakeSquare = (location) => {
    if (playing && !isOccupied(location, boards.x | boards.o)) {
      const newBoard = boards[player] | location

      setBoards({
        ...boards,
        [player]: newBoard,
      })

      if (isWinningBoard(newBoard)) {
        setWinner(player)
        setPlaying(false)
      } else {
        setPlayer(player => player === 'x' ? 'o' : 'x')
      }
    }
  }

  const restartGame = () => {
    setBoards(startingBoards)
    setWinner()
    setPlaying(true)
  }


  // Render
  // ------

  return (
    <>
      <Board>
        {squares.map((square, i) => {
          const location = 2**i

          return (
            <Square
              key={location}
              {...location}
              onClick={() => attemptTakeSquare(location)}
            >
              {square}
            </Square>
          )
        })}
      </Board>

      <button onClick={restartGame}>Restart game</button>

      <div>
        {winner ? `Player ${player} has won!` : ''}
      </div>
    </>
  );
}


// Components
// ----------

const Board = styled.div`
  width: ${squareSize * 3}px;
  display: grid;
  grid-template-rows: ${squareSize}px ${squareSize}px ${squareSize}px;
  grid-template-columns: ${squareSize}px ${squareSize}px ${squareSize}px;
  grid-template-areas:
    "square-1 square-2 square-4"
    "square-8 square-16 square-32"
    "square-64 square-128 square-256"
  ;
  border-width: 1px 0 0 1px;
  border-color: black;
  border-style: solid;
`
const Square = styled.div`
  font-family: sans-serif;
  font-size: ${squareSize}px;
  text-align: center;
  line-height: ${squareSize}px;
  border-width: 0 1px 1px 0;
  border-color: black;
  border-style: solid;
`


// Utils
// -----

const getSquares = (boards) =>
  Array(9).fill().map((_, i) =>
    (boards.x & (2**i)) >= 1 ? 'X' : (boards.o & (2**i)) >= 1 ? 'O' : ''
  )

const isOccupied = (location, board) => (location & board) > 0

const isWinningBoard = board =>
  winningBoards.some(winningBoard => ((winningBoard & board) === winningBoard))

export default App;
