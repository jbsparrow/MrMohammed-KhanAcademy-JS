// width = 600, height = 600
background(135, 64, 13);
var shelves = [];
var books = [];

// Create a list of info for 100 books.
var bookDataPool = [
    { Title: "The Giver", Author: "Lois Lowry", Stars: 4, Orientation: "display" },
    { Title: "The Hobbit", Author: "J.R.R. Tolkien", Stars: 5, Orientation: "display" },
    { Title: "The Hunger Games", Author: "Suzanne Collins", Stars: 4, Orientation: "display" },
    { Title: "The Maze Runner", Author: "James Dashner", Stars: 4, Orientation: "display" },
    { Title: "The Fault in Our Stars", Author: "John Green", Stars: 5, Orientation: "display" },
    { Title: "The Book Thief", Author: "Markus Zusak", Stars: 5, Orientation: "display" },
    { Title: "Wuthering Heights", Author: "Emily Brontë", Stars: 4, Orientation: "display" },
];


var Shelf = function(config) {
    this.y = config.y;
    this.width = config.width || width;
    this.height = config.height || 10;
    this.colour = config.colour;
    this.orientation = config.orientation; // "display" or "spine"
    this.positions = (this.orientation === "display") ? [5, 105, 205, 305, 405, 505] : [2, 32, 62, 92, 122, 152, 182, 212, 242, 272, 302, 332, 362, 392, 422, 452, 482, 512, 542, 572];
    this.books = 0;
    this.maxBooks = this.positions.length;
};

Shelf.prototype.draw = function() {
    fill(this.colour);
    rect(0, this.y, this.width, this.height);
    // Draw an outline for each book position. Draw the book on the bottom of the shelf.
    for (var i = 0; i < this.positions.length; i++) {
        noFill();
        if (this.y < 480) { // ignore the bottom bookshelf
            if (this.orientation === "display") {
                rect(this.positions[i], this.y + 20, 90, 100);
            } else {
                rect(this.positions[i], this.y + 20, 25, 100);
            }
        } else if (this.y !== 589) {
            // Use slightly shorter books for the bottom shelf.
            if (this.orientation === "display") {
                rect(this.positions[i], this.y + 20, 90, 80);
            } else {
                rect(this.positions[i], this.y + 15, 25, 94);
            }
        }
    }
};


// use for loop to draw shelves
fill(173, 117, 33);
for (var i = 0; i < 6; i++) {
    if (i < 4) {
        shelves.push(new Shelf({
            y: i * 120,
            colour: color(173, 117, 33),
            orientation: (i % 2 === 0) ? "display" : "spine",
        }));
    } else if (i === 4) {
        shelves.push(new Shelf({
            y: i * 120,
            colour: color(173, 117, 33),
            orientation: "spine"
        }));
    } else if (i === 5) {
        shelves.push(new Shelf({
            y: height - 11,
            colour: color(173, 117, 33),
            orientation: "display"
        }));
    }
}

// draw one book
// fill(214, 255, 219);
// rect(10, 20, 90, 100);
// fill(0, 0, 0);
// text(ebook.title, 15, 29, 70, 100);
// for (var i = 0; i < ebook.stars; i++) {
//     image(getImage("cute/Star"), 13 + i * 20, 90, 20, 30);
// }

for (var i = 0; i < shelves.length; i++) {
    shelves[i].draw();
}

var Book = function(config) {
    this.colour = config.colour;
    this.title = config.title;
    this.author = config.author;
    this.rating = config.rating;
    this.orientation = config.orientation; // "display" or "spine"
    this.shelf = null; // Which shelf to draw the book on. There are 6 shelves. 0 is topmost.
    this.position = null; // position on shelf. Each shelf has 6 positions if in "display" mode. 0 is leftmost. Each shelf has 12 positions if in "spine" mode. 0 is leftmost.
    this.width = config.width || (config.orientation === "display") ? 90 : 25;
    this.height = config.height || 100;
};

Book.prototype.draw = function() {
    fill(this.colour);
    if (this.orientation === "display") {
        for (var i = 0; i < shelves.length; i++) {
            if (shelves[i].orientation === this.orientation && shelves[i].books < shelves[i].maxBooks) {
                this.shelf = i;
                this.position = shelves[i].books;
                shelves[i].books++;
                break;
            }
        }
        rect(shelves[this.shelf].positions[this.position], shelves[this.shelf].y + 20, this.width, this.height);
        fill(0, 0, 0);
        text(this.title + "\n\n" + this.author, shelves[this.shelf].positions[this.position] + 5, shelves[this.shelf].y + 20, this.width - 10, this.height - 10);
        for (var i = 0; i < this.rating; i++) {
            text("⭐", shelves[this.shelf].positions[this.position] + 5, shelves[this.shelf].y + 90);
        }
    } else if (this.orientation === "spine") {
        this.width = 25;
        for (var i = 0; i < shelves.length; i++) {
            if (shelves[i].orientation === this.orientation && shelves[i].books < shelves[i].maxBooks) {
                this.shelf = i;
                this.position = shelves[i].books;
                shelves[i].books++;
                break;
            }
        }
        if (this.shelf === 4) { // Make a slightly shorter book
            rect(shelves[this.shelf].positions[this.position], shelves[this.shelf].y + 15, this.width, 94);
        } else {
            rect(shelves[this.shelf].positions[this.position], shelves[this.shelf].y + 20, this.width, this.height);
        }
    }
};

var fetchBook = function() {
    // Fetch random book from `bookDataPool` array and remove it from the array, returning the book.
    if (bookDataPool.length > 0) {
        var index = floor(random(0, bookDataPool.length));
        var book = bookDataPool[index];
        bookDataPool.splice(index, 1);
        return book;
    } else {
        return { Title: "No more books", Author: "No more books", Rating: 0 };
    }
};

var displayBooks = 0;
for (var i = 0; i < 72; i++) {
    // randomize the orientation of the book
    if (displayBooks < 12) {
        var orientation = (random(0, 2) > 0.5) ? "display" : "spine";
        if (orientation === "display") {
            displayBooks++;
        }
    } else {
        orientation = "spine";
    }
    var bookData = fetchBook();
    var book = new Book({
        width: 90,
        height: 100,
        colour: color(random(0, 255), random(0, 255), random(0, 255)),
        title: bookData.Title,
        author: bookData.Author,
        rating: bookData.Rating,
        orientation: orientation,
    });
    books.push(book);
}
if (displayBooks < 12) {
    Program.restart();
}

for (var i = 0; i < books.length; i++) {
    books[i].draw();
}