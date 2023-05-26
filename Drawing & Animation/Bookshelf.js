// width = 600, height = 600
background(135, 64, 13);
var shelves = [];
var books = [];

var ebook = {
    title: "I Know Why the Caged Bird Sings",
    stars: 4
};


var Shelf = function(config) {
    this.y = config.y;
    this.width = config.width || width;
    this.height = config.height || 10;
    this.colour = config.colour;
    this.orientation = config.orientation; // "display" or "spine"
    this.positions = (this.orientation === "display") ? [5, 105, 205, 305, 405, 505] : [2, 32, 62, 92, 122, 152, 182, 212, 242, 272, 302, 332, 362, 392, 422, 452, 482, 512, 542, 572];
    this.books = 0;
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
fill(214, 255, 219);
rect(10, 20, 90, 100);
fill(0, 0, 0);
text(ebook.title, 15, 29, 70, 100);
for (var i = 0; i < ebook.stars; i++) {
    image(getImage("cute/Star"), 13 + i * 20, 90, 20, 30);
}

for (var i = 0; i < shelves.length; i++) {
    shelves[i].draw();
}

var Book = function(config) {
    this.width = config.width;
    this.height = config.height;
    this.colour = config.colour;
    this.title = config.title;
    this.author = config.author;
    this.rating = config.rating;
    this.orientation = config.orientation; // "display" or "spine"
    this.shelf = null; // Which shelf to draw the book on. There are 6 shelves. 0 is topmost.
    this.position = null; // position on shelf. Each shelf has 6 positions if in "display" mode. 0 is leftmost. Each shelf has 12 positions if in "spine" mode. 0 is leftmost.
};

Book.prototype.draw = function() {
    fill(this.colour);
    if (this.orientation === "display") {
        rect(10 + this.position * 100, 20 + this.shelf * 120, this.width, this.height);
        fill(0, 0, 0);
        text(this.title, 15 + this.position * 100, 29 + this.shelf * 120, 70, 100);
        for (var i = 0; i < this.rating; i++) {
            text("★", 13 + this.position * 100 + i * 20, 90 + this.shelf * 120, 20, 30);
        }
    } else if (this.orientation === "spine") {
        rect(10 + this.position * 20, 20 + this.shelf * 120, this.width, this.height);
        fill(0, 0, 0);
        text(this.title, 15 + this.position * 20, 29 + this.shelf * 120, 70, 100);
        for (var i = 0; i < this.rating; i++) {
            text("★", 13 + this.position * 20 + i * 20, 90 + this.shelf * 120, 20, 30);
        }
    }
};

var w = new Book({
    width: 90,
    height: 100,
    colour: color(214, 255, 219),
    title: "Wuthering Heights",
    author: "Emily Brontë",
    rating: 4,
    orientation: "display",
});

w.draw();