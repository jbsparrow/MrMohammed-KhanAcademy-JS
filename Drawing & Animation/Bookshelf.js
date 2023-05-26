// width = 600, height = 600
background(135, 64, 13);
var shelves = [];
var books = [];

// Create a list of info for 100 books.
var bookDataPool = [
    { Title: "The Giver", Author: "Lois Lowry", Stars: 4 },
    { Title: "The Hobbit", Author: "J.R.R. Tolkien", Stars: 5 },
    { Title: "The Hunger Games", Author: "Suzanne Collins", Stars: 4 },
    { Title: "The Maze Runner", Author: "James Dashner", Stars: 4 },
    { Title: "The Fault in Our Stars", Author: "John Green", Stars: 5 },
    { Title: "The Book Thief", Author: "Markus Zusak", Stars: 5 },
    { Title: "Wuthering Heights", Author: "Emily Brontë", Stars: 4 },
    { Title: "Pride and Prejudice", Author: "Jane Austen", Stars: 5 },
    { Title: "1984", Author: "George Orwell", Stars: 5 },
    { Title: "To Kill a Mockingbird", Author: "Harper Lee", Stars: 5 },
    { Title: "Moby Dick", Author: "Herman Melville", Stars: 4 },
    { Title: "The Catcher in the Rye", Author: "J.D. Salinger", Stars: 4 },
    { Title: "A Tale of Two Cities", Author: "Charles Dickens", Stars: 4 },
    { Title: "Les Misérables", Author: "Victor Hugo", Stars: 5 },
    { Title: "War and Peace", Author: "Leo Tolstoy", Stars: 5 },
    { Title: "Animal Farm", Author: "George Orwell", Stars: 4 },
    { Title: "The Odyssey", Author: "Homer", Stars: 5 },
    { Title: "Great Expectations", Author: "Charles Dickens", Stars: 4 },
    { Title: "Romeo and Juliet", Author: "William Shakespeare", Stars: 4 },
    { Title: "Don Quixote", Author: "Miguel de Cervantes", Stars: 5 },
    { Title: "The Scarlet Letter", Author: "Nathaniel Hawthorne", Stars: 4 },
    { Title: "Crime and Punishment", Author: "Fyodor Dostoevsky", Stars: 5 },
    { Title: "A Farewell to Arms", Author: "Ernest Hemingway", Stars: 4 },
    { Title: "The Old Man and the Sea", Author: "Ernest Hemingway", Stars: 5 },
    { Title: "The Great Gatsby", Author: "F. Scott Fitzgerald", Stars: 5 },
    { Title: "Jane Eyre", Author: "Charlotte Brontë", Stars: 4 },
    { Title: "One Hundred Years of Solitude", Author: "Gabriel Garcia Marquez", Stars: 5 },
    { Title: "The Secret Garden", Author: "Frances Hodgson Burnett", Stars: 4 },
    { Title: "Lolita", Author: "Vladimir Nabokov", Stars: 4 },
    { Title: "Little Women", Author: "Louisa May Alcott", Stars: 4 },
    { Title: "Alice's Adventures in Wonderland", Author: "Lewis Carroll", Stars: 4 },
    { Title: "Sense and Sensibility", Author: "Jane Austen", Stars: 5 },
    { Title: "Middlemarch", Author: "George Eliot", Stars: 4 },
    { Title: "The Handmaid's Tale", Author: "Margaret Atwood", Stars: 4 },
    { Title: "Dracula", Author: "Bram Stoker", Stars: 5 },
    { Title: "The Adventures of Tom Sawyer", Author: "Mark Twain", Stars: 4 },
    { Title: "Frankenstein", Author: "Mary Shelley", Stars: 4 },
    { Title: "The Stranger", Author: "Albert Camus", Stars: 4 },
    { Title: "Catcher in the Rye", Author: "J.D. Salinger", Stars: 3 },
    { Title: "Lord of the Flies", Author: "William Golding", Stars: 4 },
    { Title: "The Outsiders", Author: "S. E. Hinton", Stars: 4 },
    { Title: "A Wrinkle in Time", Author: "Madeleine L'Engle", Stars: 4 },
    { Title: "Beloved", Author: "Toni Morrison", Stars: 5 },
    { Title: "Invisible Man", Author: "Ralph Ellison", Stars: 4 },
    { Title: "A Brave New World", Author: "Aldous Huxley", Stars: 5 },
    { Title: "Mrs. Dalloway", Author: "Virginia Woolf", Stars: 4 },
    { Title: "Gone with the Wind", Author: "Margaret Mitchell", Stars: 5 },
    { Title: "Anna Karenina", Author: "Leo Tolstoy", Stars: 4 },
    { Title: "The Picture of Dorian Gray", Author: "Oscar Wilde", Stars: 5 },
    { Title: "The Lord of the Rings", Author: "J.R.R. Tolkien", Stars: 5 },
    { Title: "Harry Potter and the Sorcerer's Stone", Author: "J.K. Rowling", Stars: 5 },
    { Title: "Game of Thrones", Author: "George R.R. Martin", Stars: 4 },
    { Title: "Foundation", Author: "Isaac Asimov", Stars: 4 },
    { Title: "Neuromancer", Author: "William Gibson", Stars: 4 },
    { Title: "Dune", Author: "Frank Herbert", Stars: 5 },
    { Title: "The Chronicles of Narnia", Author: "C.S. Lewis", Stars: 4 },
    { Title: "Ender's Game", Author: "Orson Scott Card", Stars: 4 },
    { Title: "The Time Machine", Author: "H.G. Wells", Stars: 4 },
    { Title: "A Song of Ice and Fire", Author: "George R.R. Martin", Stars: 5 },
    { Title: "The Da Vinci Code", Author: "Dan Brown", Stars: 3 },
    { Title: "Catch-22", Author: "Joseph Heller", Stars: 4 },
    { Title: "Slaughterhouse-Five", Author: "Kurt Vonnegut", Stars: 4 },
    { Title: "Brave New World", Author: "Aldous Huxley", Stars: 4 },
    { Title: "The Alchemist", Author: "Paulo Coelho", Stars: 4 },
    { Title: "The Bell Jar", Author: "Sylvia Plath", Stars: 4 },
    { Title: "The Divine Comedy", Author: "Dante Alighieri", Stars: 5 },
    { Title: "The Little Prince", Author: "Antoine de Saint-Exupéry", Stars: 5 },
    { Title: "Ulysses", Author: "James Joyce", Stars: 5 },
    { Title: "Life of Pi", Author: "Yann Martel", Stars: 4 },
    { Title: "Gulliver's Travels", Author: "Jonathan Swift", Stars: 4 },
    { Title: "The Brother's Karamazov", Author: "Fyodor Dostoevsky", Stars: 5 },
    { Title: "The Shining", Author: "Stephen King", Stars: 4 },
    { Title: "Watership Down", Author: "Richard Adams", Stars: 4 },
    { Title: "The Count of Monte Cristo", Author: "Alexandre Dumas", Stars: 5 },
    { Title: "Mansfield Park", Author: "Jane Austen", Stars: 4 },
    { Title: "The Adventures of Sherlock Holmes", Author: "Arthur Conan Doyle", Stars: 5 },
    { Title: "The Call of the Wild", Author: "Jack London", Stars: 4 },
    { Title: "Of Mice and Men", Author: "John Steinbeck", Stars: 4 },
    { Title: "Rebecca", Author: "Daphne du Maurier", Stars: 4 },
    { Title: "Bleak House", Author: "Charles Dickens", Stars: 4 },
    { Title: "The Inferno", Author: "Dante Alighieri", Stars: 5 },
    { Title: "Madame Bovary", Author: "Gustave Flaubert", Stars: 4 },
    { Title: "The Wind in the Willows", Author: "Kenneth Grahame", Stars: 4 },
    { Title: "Emma", Author: "Jane Austen", Stars: 4 },
    { Title: "The Jungle Book", Author: "Rudyard Kipling", Stars: 4 },
    { Title: "The Grapes of Wrath", Author: "John Steinbeck", Stars: 5 },
    { Title: "To the Lighthouse", Author: "Virginia Woolf", Stars: 4 },
    { Title: "Treasure Island", Author: "Robert Louis Stevenson", Stars: 4 },
    { Title: "The Hound of the Baskervilles", Author: "Arthur Conan Doyle", Stars: 5 },
    { Title: "The Three Musketeers", Author: "Alexandre Dumas", Stars: 4 },
    { Title: "Mere Christianity", Author: "C.S. Lewis", Stars: 5 },
    { Title: "Pilgrim's Progress", Author: "John Bunyan", Stars: 4 },
    { Title: "On the Road", Author: "Jack Kerouac", Stars: 4 },
    { Title: "Catch 22", Author: "Joseph Heller", Stars: 5 },
    { Title: "The Scarlet Pimpernel", Author: "Emmuska Orczy", Stars: 4 },
    { Title: "Paradise Lost", Author: "John Milton", Stars: 4 },
    { Title: "Persuasion", Author: "Jane Austen", Stars: 5 },
    { Title: "The Prince", Author: "Niccolò Machiavelli", Stars: 4 },
    { Title: "The Metamorphosis", Author: "Franz Kafka", Stars: 4 },
    { Title: "A Clockwork Orange", Author: "Anthony Burgess", Stars: 4 },
    { Title: "The Iliad", Author: "Homer", Stars: 5 },
    { Title: "The Master and Margarita", Author: "Mikhail Bulgakov", Stars: 5 },
    { Title: "Fahrenheit 451", Author: "Ray Bradbury", Stars: 5 },
    { Title: "The Name of the Rose", Author: "Umberto Eco", Stars: 4 },
    { Title: "The Brothers Karamazov", Author: "Fyodor Dostoevsky", Stars: 5 },
    { Title: "The Diary of a Young Girl", Author: "Anne Frank", Stars: 5 },
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
    colorMode(HSB);
    fill(this.colour.h, this.colour.s, this.colour.b);
    textSize(12.0);
    colorMode(RGB);
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
        text(this.title + "\n\nBy: " + this.author, shelves[this.shelf].positions[this.position] + 5, shelves[this.shelf].y + 25, this.width - 10, this.height - 10);
        // Draw stars
        var starWidth = 15;
        var totalStarWidth = this.rating * starWidth;
        var starStart = shelves[this.shelf].positions[this.position] + ((this.width - totalStarWidth) / 2);
        for (var i = 0; i < this.rating; i++) {
            text("⭐", starStart + i * starWidth, shelves[this.shelf].y + 105, this.width - 10, this.height - 10);
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
            pushMatrix();
            translate(shelves[this.shelf].positions[this.position] + this.width / 2, shelves[this.shelf].y + this.height / 2);
            rotate(90);
            fill(0, 0, 0);
            textSize(10.5);
            text(this.title, -33.0, -9.5, this.height - 10, this.width - 10);
            textSize(8.5);
            text(this.author, -32.3, 2.2, this.height - 30, this.width - 10);
            textSize(10.5);
            text(this.rating + "⭐", 36.8, 0.5, this.height - 10, this.width - 10);
            textSize(12.0);
            popMatrix();
        } else {
            rect(shelves[this.shelf].positions[this.position], shelves[this.shelf].y + 20, this.width, this.height);
            pushMatrix();
            translate(shelves[this.shelf].positions[this.position] + this.width / 2, shelves[this.shelf].y + this.height / 2);
            rotate(90);
            fill(0, 0, 0);
            textSize(10.5);
            text(this.title, -28.0, -9.5, this.height - 10, this.width - 1);
            textSize(8.5);
            text(this.author, -28.0, 2.2, this.height - 15, this.width - 10);
            textSize(10.5);
            text(this.rating + "⭐", 43.7, 0.5, this.height - 10, this.width - 10);
            textSize(12.0);
            popMatrix();
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
var inc = 255 / 72;
var hueue = 0;
// inc = (random(0, 1) > 0.5) ? inc : -inc;
// if (inc < 0) {
//     hueue = 255;
// }
colorMode(HSB);
for (var i = 0; i < 72; i++) {
    // randomize the orientation of the book
    // if (displayBooks < 12) {
    //     var orientation = (random(0, 2) > 0.5) ? "display" : "spine";
    //     if (orientation === "display") {
    //         displayBooks++;
    //     }
    // } else {
    //     orientation = "spine";
    // }
    if (i < 6 || i > 26 && i < 33) {
        var orientation = "display";
        displayBooks++;
    } else {
        var orientation = "spine";
    }
    var bookData = fetchBook();
    var book = new Book({
        width: 90,
        height: 100,
        // colour: color(random(0, 255), random(0, 255), random(0, 255)),
        // colour: color(hueue, 255, 255),
        colour: { h: hueue, s: 255, b: 255, direction: 1 },
        title: bookData.Title,
        author: bookData.Author,
        rating: bookData.Stars,
        orientation: orientation,
    });
    books.push(book);
    hueue += inc;
}
if (displayBooks < 12) {
    Program.restart();
}
colorMode(RGB);

for (var i = 0; i < books.length; i++) {
    books[i].draw();
}

var draw = function() {
    colorMode(RGB);
    background(135, 64, 13);
    for (var i = 0; i < shelves.length; i++) {
        shelves[i].draw();
    }
    for (var i = 0; i < books.length; i++) {
        books[i].draw();
        if (books[i].colour.h >= 255) {
            books[i].colour.direction = -1;
            books[i].colour.h = 255;
        } else if (books[i].colour.h <= 0) {
            books[i].colour.direction = 1;
            books[i].colour.h = 0;
        }
        if (books[i].colour.direction === 1) {
            books[i].colour.h += inc;
        }
        if (books[i].colour.direction === -1) {
            books[i].colour.h -= inc;
        }
    }
};