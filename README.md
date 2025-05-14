# Rush Hour Puzzle Solver

Tugas Kecil 3 IF2211 Strategi Algoritma

bang, udah bang... gakuat, cukup dengan tubes/tucilnya 

```
Tucil3_13523009/
├── README.md
├── .gitignore
├── package.json
├── next.config.js
├── bin/              
├── doc/                
├── test/             
│   └── test1.txt
└── src/               
    ├── app/            
    │   ├── page.js     # Home page (homepage)
    │   ├── layout.js   # Root layout
    │   ├── globals.css # Global styles
    │   ├── game/       # Game page
    │   │   └── page.js # Game interface
    │   └── creators/   # Creators page
    │       └── page.js # Team information
    ├── components/     # Reusable UI components
    │   ├── index.js    # Exports all components
    │   ├── Button.js   # Button components
    │   ├── Board.js    # Game board component
    │   ├── Piece.js    # Piece component for cars/vehicles
    │   ├── Typography.js # Standardized text components
    │   └── NavBar.js   # Navigation bar component
    ├── lib/            # Core logic
    │   ├── index.js    # Exports core utilities and models
    │   ├── models.js   # Models (Board, Piece, GameState)
    │   ├── algorithms/
    │   │   ├── index.js    # Exports all algorithms
    │   │   ├── Greedy.js   # Greedy Best First Search
    │   │   ├── UCS.js      # Uniform Cost Search
    │   │   └── AStar.js    # A* algorithm
    │   ├── heuristics/
    │   │   ├── index.js    # Exports all heuristics
    │   │   ├── ManhattanDistance.js # Manhattan distance heuristic
    │   │   └── BlockingPieces.js    # Blocking pieces heuristic
    │   └── utils.js         
    └── public/         
        └── images/
            ├── car.svg     
            ├── truck.svg    
            └── exit.svg    
```
