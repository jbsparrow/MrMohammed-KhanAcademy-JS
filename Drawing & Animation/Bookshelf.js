// width = 600, height = 600
background(135, 64, 13);
var shelves = [];
var books = [];

// Create a list of info for 100 books.
var bookDataPool = [
    { Title: "The Giver", Author: "Lois Lowry", Stars: 4, Description: "A thought-provoking novel set in a dystopian society where a boy named Jonas is chosen to be the receiver of memories, discovering the dark secrets behind his previously 'perfect' community." },
    { Title: "The Hobbit", Author: "J.R.R. Tolkien", Stars: 5, Description: "An adventurous tale of Bilbo Baggins, a comfort-loving unambitious hobbit, who embarks on a perilous journey to help a group of dwarves reclaim their homeland from a fearsome dragon." },
    { Title: "The Hunger Games", Author: "Suzanne Collins", Stars: 4, Description: "A thrilling dystopian novel in which the protagonist, Katniss Everdeen, is forced to participate in a deadly televised game where the stakes are life and death." },
    { Title: "The Maze Runner", Author: "James Dashner", Stars: 4, Description: "A captivating science fiction novel featuring a boy named Thomas who wakes up in a mysterious maze with no memory of his past, along with other boys facing the same predicament." },
    { Title: "The Fault in Our Stars", Author: "John Green", Stars: 5, Description: "A poignant story of teenage love and suffering between the intelligent and sharp-witted Hazel, who has terminal cancer, and Augustus, a boy she meets in a cancer support group." },
    { Title: "The Book Thief", Author: "Markus Zusak", Stars: 5, Description: "A powerful story set in Nazi Germany, narrated by Death, about a young girl named Liesel, who finds solace in stealing books and sharing them with others." },
    { Title: "Wuthering Heights", Author: "Emily Brontë", Stars: 4, Description: "A classic novel of destructive, passionate love between the fiery Catherine Earnshaw and the dark, brooding Heathcliff, set against the stark backdrop of the Yorkshire moors." },
    { Title: "Pride and Prejudice", Author: "Jane Austen", Stars: 5, Description: "A timeless classic that explores the prejudices and social customs of early 19th-century England, focusing on the intelligent and spirited Elizabeth Bennet and her complicated relationship with the proud Mr. Darcy." },
    { Title: "1984", Author: "George Orwell", Stars: 5, Description: "A chilling dystopian novel depicting a future where independent thought is suppressed under a totalitarian regime, and 'Big Brother' sees all." },
    { Title: "To Kill a Mockingbird", Author: "Harper Lee", Stars: 5, Description: "An unforgettable novel of a childhood in a sleepy Southern town, and the crisis of conscience that rocked it, through the eyes of a young girl as her father—a crusading local lawyer—risks everything to defend a black man unjustly accused of a terrible crime." },
    { Title: "Moby Dick", Author: "Herman Melville", Stars: 4, Description: "An epic saga of Captain Ahab's obsessive quest to hunt down the white whale Moby Dick, who took his leg in a previous encounter." },
    { Title: "The Catcher in the Rye", Author: "J.D. Salinger", Stars: 4, Description: "A controversial novel originally published for adults, it has since become popular with adolescent readers for its themes of teenage angst and alienation. It's the story of a few days in the life of a sixteen-year-old boy, Holden Caulfield, who's been expelled from prep school and has felt alienated and disconnected from the rest of the world." },
    { Title: "The Great Gatsby", Author: "F. Scott Fitzgerald", Stars: 5, Description: "An iconic novel of the Roaring Twenties that captures the flamboyance, carelessness, and decadence of the era through the story of the enigmatic and wealthy Jay Gatsby and his unrequited love for the beautiful Daisy Buchanan." },
    { Title: "One Hundred Years of Solitude", Author: "Gabriel García Márquez", Stars: 5, Description: "A defining work of magical realism, the novel tells the story of the multi-generational Buendia family, whose patriarch, Jose Arcadio Buendia, founds the town of Macondo." },
    { Title: "War and Peace", Author: "Leo Tolstoy", Stars: 4, Description: "An epic novel of love and war that chronicles the lives of five Russian aristocratic families during Napoleon’s invasion of Russia." },
    { Title: "Les Misérables", Author: "Victor Hugo", Stars: 4, Description: "An expansive historical novel that covers several decades in 19th century France, focusing on the stories of characters such as Jean Valjean, a former convict who seeks redemption, and Javert, the police inspector who means to bring him to justice." },
    { Title: "Animal Farm", Author: "George Orwell", Stars: 5, Description: "An allegorical novella reflecting events leading up to the Russian Revolution of 1917 and onto the Stalinist era of the Soviet Union, represented by farm animals who rebel against their farmer to establish a society where the animals can be equal, free, and happy." },
    { Title: "Jane Eyre", Author: "Charlotte Brontë", Stars: 5, Description: "A novel of intense emotional power, heightened atmosphere and fierce intelligence, featuring the story of the passionate love between Jane Eyre, a young girl alone in the world, and the rich, brilliant, domineering Rochester." },
    { Title: "Don Quixote", Author: "Miguel de Cervantes Saavedra", Stars: 5, Description: "Widely regarded as one of the greatest works of fiction ever published, this novel follows the adventures of a man who reads so many chivalric novels that he decides to set out to revive chivalry, under the name Don Quixote." },
    { Title: "The Odyssey", Author: "Homer", Stars: 4, Description: "One of the oldest works of Western literature, this epic poem follows the hero Odysseus as he journeys home after the ten-year Trojan War, facing numerous perils and adventures along the way." },
    { Title: "Ulysses", Author: "James Joyce", Stars: 4, Description: "A modernist novel that parallels Homer's Odyssey and is set in Dublin during the course of one day, June 16, 1904. The novel is highly allusive and also imitates the styles of different periods of English literature." },
    { Title: "Lolita", Author: "Vladimir Nabokov", Stars: 5, Description: "A novel that is noteworthy for its controversial subject: the protagonist and unreliable narrator, a middle-aged literature professor under the pseudonym Humbert Humbert, is obsessed with a 12-year-old girl, Dolores Haze, with whom he becomes sexually involved after he becomes her stepfather." },
    { Title: "The Trial", Author: "Franz Kafka", Stars: 4, Description: "A novel written by Franz Kafka between 1914 and 1915 and published posthumously in 1925. One of his best-known works, it tells the story of Josef K., a man arrested and prosecuted by a remote, inaccessible authority, with the nature of his crime revealed neither to him nor to the reader." },
    { Title: "In Search of Lost Time", Author: "Marcel Proust", Stars: 5, Description: "Known both for its length and its theme of involuntary memory, the novel consists of seven volumes and is widely considered to be one of the greatest books in world literature." },
    { Title: "Moby-Dick", Author: "Herman Melville", Stars: 4, Description: "The narrative of Captain Ahab's obsessive quest to seek revenge on the great white whale that bit off his leg, filled with symbolic and philosophical elements." },
    { Title: "Catch-22", Author: "Joseph Heller", Stars: 5, Description: "A satirical dark comedy novel that uses a distinctive non-chronological third-person omniscient narration, describing events from the points of view of different characters, and separate storylines that are out of sequence so that the timeline develops along with the plot." },
    { Title: "Wuthering Heights", Author: "Emily Brontë", Stars: 5, Description: "An intense love story set against the starkly beautiful backdrop of the wild English moorlands, this novel's exploration of social class, love, and obsession has been a timeless classic for generations." },
    { Title: "The Great Gatsby", Author: "F. Scott Fitzgerald", Stars: 5, Description: "A classic novel of the Jazz Age, exploring themes of decadence, idealism, resistance to change, social upheaval, and excess. The narrative is a critique of the American Dream as it follows the mysterious millionaire Jay Gatsby and his passion for the beautiful Daisy Buchanan." },
    { Title: "To Kill a Mockingbird", Author: "Harper Lee", Stars: 5, Description: "A timeless story of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. The story is narrated by a young girl who learns about human nature and its flaws." },
    { Title: "1984", Author: "George Orwell", Stars: 5, Description: "A dystopian novel set in Airstrip One, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation. The superstate and its residents are dictated to by a political regime euphemistically named English Socialism, shortened to 'Ingsoc' in Newspeak, the government's invented language." },
    { Title: "Pride and Prejudice", Author: "Jane Austen", Stars: 5, Description: "A romantic novel of manners that follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner. It is a story of love and life among English gentility during the Georgian era." },
    { Title: "The Catcher in the Rye", Author: "J.D. Salinger", Stars: 4, Description: "A novel featuring the strong yet complex character of 16-year-old Holden Caulfield, portrayed through a cynical lens. With certain elegance the writer directly tackles complex human situations and the character's deep-seated frustrations and confusions." },
    { Title: "The Diary of a Young Girl", Author: "Anne Frank", Stars: 5, Description: "The poignant real-life diary of a young Jewish girl who went into hiding with her family in Amsterdam during World War II. Her diary ends abruptly when, in August 1944, they are all betrayed." },
    { Title: "Dune", Author: "Frank Herbert", Stars: 5, Description: "Set in the distant future amidst a feudal interstellar society in which noble houses control planetary fiefs, Dune tells the story of young Paul Atreides as he and his family accept control of the desert planet Arrakis, the only source of the 'spice' melange, the most important and valuable substance in the cosmos." },
    { Title: "The Lord of the Rings", Author: "J.R.R. Tolkien", Stars: 5, Description: "An epic high fantasy novel set in Middle-earth, the novel follows the quest of the One Ring and the epic journey of a group of heroes, the Fellowship of the Ring, who set out to destroy the Ring and ensure the downfall of its maker, the Dark Lord Sauron." },
    { Title: "Gone with the Wind", Author: "Margaret Mitchell", Stars: 4, Description: "An epic historical romance, set in Georgia during the American Civil War and Reconstruction era. It depicts the struggles of young Scarlett O'Hara, the spoiled daughter of a well-to-do plantation owner, who uses every means at her disposal to claw her way out of the poverty she finds herself in after Sherman's March to the Sea." },
    { Title: "The Adventures of Huckleberry Finn", Author: "Mark Twain", Stars: 4, Description: "Often considered one of the first in major American literature to be written in the vernacular, characterized by local color regionalism. It follows the adventures of Huck and his friend Jim, a runaway slave, as they travel along the Mississippi River." },
    { Title: "A Tale of Two Cities", Author: "Charles Dickens", Stars: 4, Description: "Set in London and Paris before and during the French Revolution. With well over 200 million copies sold, it is among the most famous works in the history of fictional literature. The plot centers on the years leading up to the French Revolution and culminates in the Jacobin Reign of Terror." },
    { Title: "Les Misérables", Author: "Victor Hugo", Stars: 4, Description: "A historical novel considered one of the greatest novels of the 19th century. It follows the lives and interactions of several characters over a twenty-year period in the early 19th century, starting in 1815, the year of Napoleon's defeat at Waterloo." },
    { Title: "Little Women", Author: "Louisa May Alcott", Stars: 4, Description: "A novel that follows the lives of the four March sisters—Meg, Jo, Beth, and Amy—and details their passage from childhood to womanhood. It is loosely based on the author and her three sisters." },
    { Title: "Rebecca", Author: "Daphne du Maurier", Stars: 4, Description: "A novel of suspense and passion about a young woman who, after a whirlwind romance and a hasty marriage, returns to her husband's English country estate to find herself living in the shadow of his first wife, the elegant and urbane Rebecca." },
    { Title: "Brave New World", Author: "Aldous Huxley", Stars: 4, Description: "A dystopian novel set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy. The novel anticipates huge scientific developments in reproductive technology, sleep-learning, psychological manipulation and classical conditioning that combine profoundly to change society." },
    { Title: "The Kite Runner", Author: "Khaled Hosseini", Stars: 4, Description: "A novel set against the backdrop of tumultuous events, from the fall of Afghanistan's monarchy through the Soviet military intervention, the exodus of refugees to Pakistan and the United States, and the rise of the Taliban regime. It explores themes of guilt and redemption through the friendship between Amir, the son of a wealthy Kabul merchant, and Hassan, the son of Amir's father's servant." },
    { Title: "Crime and Punishment", Author: "Fyodor Dostoevsky", Stars: 5, Description: "A novel focusing on the mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished ex-student in Saint Petersburg who formulates a plan to kill an unscrupulous pawnbroker for her money." },
    { Title: "The Old Man and the Sea", Author: "Ernest Hemingway", Stars: 4, Description: "A short novel telling the story of Santiago, an aging Cuban fisherman who struggles with a giant marlin far out in the Gulf Stream off the coast of Cuba. It's a tale about personal triumph and the resilience of the human spirit." },
    { Title: "The Grapes of Wrath", Author: "John Steinbeck", Stars: 4, Description: "A novel set during the Great Depression, focusing on the Joads, a poor family of tenant farmers driven from their Oklahoma home by drought, economic hardship, and changes in financial and agricultural industries. Their journey to California in search of work and dignity is an indictment of the inequities of the American Dream." },
    { Title: "Alice's Adventures in Wonderland", Author: "Lewis Carroll", Stars: 4, Description: "A novel of whimsical adventures in a fantastical world filled with anthropomorphic creatures, as experienced by a curious and intelligent young girl named Alice. Its narrative, structure, characters, and imagery have been enormously influential in both popular culture and literature." },
    { Title: "Anna Karenina", Author: "Leo Tolstoy", Stars: 5, Description: "An epic novel of love, betrayal, and death, the narrative centers around the doomed love affair between the adulterous Anna and Count Vronsky, contrasted with Levin and Kitty’s journey from initial heartbreak to a heartfelt and happy marriage." },
    { Title: "Moby-Dick", Author: "Herman Melville", Stars: 4, Description: "An epic sea story of Captain Ahab's obsessive quest to hunt down the white whale Moby Dick, who maimed him in a previous encounter. The narrative is interspersed with philosophical and scientific digressions." },
    { Title: "Middlemarch", Author: "George Eliot", Stars: 5, Description: "A novel that explores a multitude of issues including the status of women, the nature of marriage, idealism and self-interest, religion and hypocrisy, political reform, and education. It's set in a fictitious Midlands town from 1829 to 1832 and follows several distinct, intersecting stories with a large cast of characters." },
    { Title: "Walden", Author: "Henry David Thoreau", Stars: 4, Description: "A reflection upon simple living in natural surroundings. The work is part personal declaration of independence, social experiment, voyage of spiritual discovery, satire, and manual for self-reliance." },
    { Title: "Beloved", Author: "Toni Morrison", Stars: 5, Description: "A novel inspired by the true story of a black slave woman, Margaret Garner, who in 1856 escaped from a Kentucky plantation with her husband and children, was captured in Ohio and made a tragic decision." },
    { Title: "The Stranger", Author: "Albert Camus", Stars: 4, Description: "The story of Meursault, an indifferent French Algerian described as a citizen of France domiciled in North Africa, a man of the Mediterranean who loves the sun and the sea. The novel is famous for its first lines: 'Mother died today. Or maybe, yesterday; I can't be sure.'" },
    { Title: "In Cold Blood", Author: "Truman Capote", Stars: 5, Description: "A novel that details the 1959 murders of four members of the Herbert Clutter family in the small farming community of Holcomb, Kansas. Capote researched for six years to produce this 'nonfiction novel', transforming true crime into high art." },
    { Title: "The Bell Jar", Author: "Sylvia Plath", Stars: 5, Description: "A semi-autobiographical novel relating the story of Esther Greenwood, a young woman's mental breakdown following a summer job as a guest editor at a magazine in New York City in the 1950s." },
    { Title: "One Hundred Years of Solitude", Author: "Gabriel García Márquez", Stars: 5, Description: "Considered the author's masterpiece, the novel tells the story of the Buendía family, and chronicles the irreconcilable conflict between the desire for solitude and the need for love—in rich, imaginative prose that has come to define an entire genre known as 'magical realism'." },
    { Title: "The Canterbury Tales", Author: "Geoffrey Chaucer", Stars: 4, Description: "A collection of 24 stories that runs to over 17,000 lines written in Middle English by Geoffrey Chaucer. The tales, mostly written in verse, are presented as part of a story-telling contest by a group of pilgrims as they travel together from London to Canterbury to visit the shrine of Saint Thomas Becket at Canterbury Cathedral." },
    { Title: "Gulliver's Travels", Author: "Jonathan Swift", Stars: 4, Description: "A prose satire that is both a satire on human nature and a parody of the 'travellers' tales' literary subgenre. It is Swift's best known full-length work, and a classic of English literature. The book became popular as soon as it was published." },
    { Title: "Heart of Darkness", Author: "Joseph Conrad", Stars: 4, Description: "A novel that explores the thin line between civilization and barbarity. The story follows the journey of Charlie Marlow as he travels down the Congo River, facing the darkness within himself as he confronts the darkness of European colonialism and the haunting figure of Kurtz." },
    { Title: "The Count of Monte Cristo", Author: "Alexandre Dumas", Stars: 5, Description: "An adventure novel that primarily takes place in France, Italy, and the Mediterranean in the historical era of the Bourbon Restoration through the reign of Louis-Philippe of France. It follows an epic story of revenge by Dantès who is first, a sailor, secondly a count, and is also a seeker of revenge due to the unjust treatment he receives from his enemies." },
    { Title: "Dracula", Author: "Bram Stoker", Stars: 5, Description: "An 1897 Gothic horror novel that introduces Count Dracula, and established many conventions of subsequent vampire fantasy. The novel tells the story of Dracula's attempt to move from Transylvania to England so that he may find new blood and spread the undead curse, and of the battle between Dracula and a small group of people led by Professor Abraham Van Helsing." },
    { Title: "Don Quixote", Author: "Miguel de Cervantes", Stars: 5, Description: "Regarded as the first modern novel, it follows the adventures of a noble named Alonso Quixano who reads so many chivalric romances that he loses his mind and decides to become a knight-errant to revive chivalry and serve his nation." },
    { Title: "Madame Bovary", Author: "Gustave Flaubert", Stars: 4, Description: "A novel about the bored and unhappy Emma Bovary who longs for passion and seeks escape in fantasies of high romance, in voracious spending and, eventually, in adultery but soon finds that reality cannot match her romantic expectations." },
    { Title: "War and Peace", Author: "Leo Tolstoy", Stars: 5, Description: "An epic novel that intertwines the lives of five families against the backdrop of Napoleon's invasion of Russia. Its vast canvas includes 580 characters, many historical with others fictional. The story moves from family life to the headquarters of Napoleon, from the court of Alexander I of Russia to the battlefields of Austerlitz and Borodino." },
    { Title: "A Farewell to Arms", Author: "Ernest Hemingway", Stars: 4, Description: "A novel set during the Italian campaign of World War I, the book, like his other works, is full of the terse prose and stoic, disillusioned characters for which Hemingway is known. It is a first-person account of an American, Frederic Henry, serving as a Lieutenant (\"Tenente\") in the ambulance corps of the Italian Army." },
    { Title: "The Brothers Karamazov", Author: "Fyodor Dostoevsky", Stars: 5, Description: "The final novel by Dostoevsky, it tells the passionate philosophical debate carried on by three brothers and their dissolute father. The narrative explores themes of faith, reason, free will and morality framed within a family drama." },
    { Title: "Ulysses", Author: "James Joyce", Stars: 4, Description: "Known for its stream-of-consciousness writing style, the novel parallels Homer’s Odyssey. The events of the novel take place in Dublin on a single day, June 16, 1904, and follows several characters through the city." },
    { Title: "Lolita", Author: "Vladimir Nabokov", Stars: 4, Description: "A novel that is notable for its controversial subject: the protagonist and unreliable narrator, middle-aged literature professor under the pseudonym Humbert Humbert, is obsessed with a 12-year-old girl, Dolores Haze, with whom he becomes sexually involved after he becomes her stepfather." },
    { Title: "The Trial", Author: "Franz Kafka", Stars: 4, Description: "A novel written by Franz Kafka between 1914 and 1915 and published posthumously in 1925. One of his best-known works, it tells the story of Josef K., a man arrested and prosecuted by a remote, inaccessible authority, with the nature of his crime revealed neither to him nor to the reader." },
    { Title: "In Search of Lost Time", Author: "Marcel Proust", Stars: 5, Description: "A monumental seven-volume novel that explores themes of memory, time, love, art, and society. It follows the narrator's reminiscences of his past experiences and the people he encountered, offering a profound reflection on the human condition." },
    { Title: "The Picture of Dorian Gray", Author: "Oscar Wilde", Stars: 4, Description: "A novel that tells the story of a young man named Dorian Gray, who remains eternally youthful while a portrait of him ages and displays the effects of his immoral actions. It delves into themes of beauty, decadence, and the corrupting influence of society." },
    { Title: "The Sound and the Fury", Author: "William Faulkner", Stars: 4, Description: "A novel that employs a unique narrative style to explore the decline of the Compson family in the Southern United States. It delves into themes of memory, time, and the disintegration of traditional Southern values." },
    { Title: "Slaughterhouse-Five", Author: "Kurt Vonnegut", Stars: 5, Description: "A satirical science fiction novel that follows the experiences of Billy Pilgrim, an American soldier who becomes \"unstuck in time\" and experiences various moments of his life, including his time as a prisoner of war during World War II and encounters with aliens from the planet Tralfamadore." },
    { Title: "The Handmaid's Tale", Author: "Margaret Atwood", Stars: 5, Description: "A dystopian novel set in a totalitarian society where women are oppressed and reduced to the roles of reproductive vessels. The story follows Offred, a handmaid who struggles to survive and maintain her identity in a society governed by strict rules and religious fundamentalism." },
    { Title: "The Alchemist", Author: "Paulo Coelho", Stars: 4, Description: "A philosophical novel that tells the story of Santiago, an Andalusian shepherd boy who embarks on a journey in search of a hidden treasure. Along the way, he discovers the importance of following his dreams and finding his own personal legend." },
    { Title: "The Road", Author: "Cormac McCarthy", Stars: 4, Description: "A post-apocalyptic novel that follows a father and his young son as they journey through a devastated landscape, struggling to survive and maintain their humanity in a world stripped of hope and civilization." },
    { Title: "Beloved", Author: "Toni Morrison", Stars: 5, Description: "A powerful novel that explores the effects of slavery and its aftermath on the lives of African Americans. It tells the story of Sethe, a former slave who is haunted by the ghost of her deceased daughter and must confront her traumatic past." },
    { Title: "The Secret History", Author: "Donna Tartt", Stars: 4, Description: "A suspenseful novel that follows a group of students studying classics at an elite New England college. As they become entangled in a dark and dangerous secret, their lives unravel with devastating consequences." },
    { Title: "Americanah", Author: "Chimamanda Ngozi Adichie", Stars: 4, Description: "A novel that explores themes of race, identity, and cultural assimilation through the story of Ifemelu, a young Nigerian woman who moves to the United States to pursue her education and experiences both success and hardship in her quest for belonging." },
    { Title: "The Name of the Wind", Author: "Patrick Rothfuss", Stars: 5, Description: "The first book in an epic fantasy series that follows the story of Kvothe, an orphaned musician and magician, as he recounts his journey to becoming a legendary figure. It is a tale of adventure, magic, and the pursuit of knowledge." },
    { Title: "The Girl with the Dragon Tattoo", Author: "Stieg Larsson", Stars: 4, Description: "A gripping thriller that follows journalist Mikael Blomkvist and computer hacker Lisbeth Salander as they investigate a decades-old disappearance and uncover a web of dark secrets and corruption. It is the first book in the Millennium series." },
    { Title: "The Shadow of the Wind", Author: "Carlos Ruiz Zafón", Stars: 5, Description: "A captivating novel set in post-World War II Barcelona, it follows young Daniel Sempere as he becomes engrossed in the mysterious and dangerous world of books, uncovering a dark secret surrounding an enigmatic author." },
    { Title: "Norwegian Wood", Author: "Haruki Murakami", Stars: 4, Description: "A coming-of-age novel that explores themes of love, loss, and mental health. Set in 1960s Tokyo, it follows Toru Watanabe as he navigates his relationships with two very different women and grapples with the weight of his past." },
    { Title: "The Martian", Author: "Andy Weir", Stars: 4, Description: "A science fiction novel that tells the story of astronaut Mark Watney, who is stranded alone on Mars after his crewmates believe him to be dead. With limited resources, he must use his ingenuity and scientific knowledge to survive and find a way to communicate with Earth." },
    { Title: "Educated", Author: "Tara Westover", Stars: 5, Description: "A memoir that recounts the author's upbringing in a strict and abusive household in rural Idaho, and her journey to break free from her isolated and uneducated past to pursue education and self-discovery." },
    { Title: "The Odyssey", Author: "Homer", Stars: 5, Description: "An ancient Greek epic poem attributed to Homer, it follows the Greek hero Odysseus as he embarks on a perilous journey back home to Ithaca after the fall of Troy, encountering mythical creatures and facing numerous challenges along the way." },
    { Title: "The Divine Comedy", Author: "Dante Alighieri", Stars: 5, Description: "An epic poem divided into three parts—Inferno, Purgatorio, and Paradiso—depicting the journey of the poet Dante through Hell, Purgatory, and Heaven, guided by the Roman poet Virgil and later by his beloved Beatrice." },
    { Title: "Gone Girl", Author: "Gillian Flynn", Stars: 4, Description: "A psychological thriller that explores the complexities of a toxic marriage and the disappearance of a woman named Amy Dunne. Told through alternating perspectives, the novel twists and turns as it delves into the dark secrets and deceptions of its characters." },
    { Title: "The Handmaid's Tale", Author: "Margaret Atwood", Stars: 5, Description: "A dystopian novel set in a totalitarian society where women are oppressed and reduced to the roles of reproductive vessels. The story follows Offred, a handmaid who struggles to survive and maintain her identity in a society governed by strict rules and religious fundamentalism." },
    { Title: "The Time Traveler's Wife", Author: "Audrey Niffenegger", Stars: 4, Description: "A love story that transcends time and explores the intricacies of fate and free will. It follows the relationship between Henry, a man with a genetic disorder that causes him to time travel involuntarily, and Clare, his wife who experiences the unpredictable effects of his time-traveling." },
    { Title: "The Nightingale", Author: "Kristin Hannah", Stars: 5, Description: "A historical fiction novel set during World War II, it tells the story of two sisters in Nazi-occupied France—one involved in the Resistance and the other trying to survive and protect her family. It explores themes of bravery, sacrifice, and the strength of sisterhood." },
    { Title: "The Catcher in the Rye", Author: "J.D. Salinger", Stars: 4, Description: "A classic coming-of-age novel that follows Holden Caulfield, a disillusioned teenager navigating the complexities of adolescence and society. It explores themes of alienation, identity, and the loss of innocence." },
    { Title: "The Help", Author: "Kathryn Stockett", Stars: 5, Description: "Set in 1960s Mississippi, it tells the story of three women—two African American maids and a young white woman—who build an unlikely friendship and embark on a secret writing project that exposes the racial injustices and inequalities of their time." },
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
    colorMode(RGB);
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


for (var i = 0; i < shelves.length; i++) {
    shelves[i].draw();
}

var drawExpandedBook = function() {

};

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
    this.x = null;
    this.y = null;
    this.description = config.description || "No description available.";
    this.url = config.url || "https://www.torontopubliclibrary.ca/";
    this.onClicked = config.onClicked || function() {
        // Animate the book expanding from where it is on the bookshelf to the centre of the screen, keeping the text on it in the correct proportions.
        drawExpandedBook(this);
    };
};

Book.prototype.draw = function() {
    fill(this.colour);
    textSize(12.0);
    if (this.orientation === "display") {
        for (var i = 0; i < shelves.length; i++) {
            if (shelves[i].orientation === this.orientation && shelves[i].books < shelves[i].maxBooks) {
                this.shelf = i;
                this.position = shelves[i].books;
                shelves[i].books++;
                break;
            }
        }
        this.x = shelves[this.shelf].positions[this.position];
        this.y = shelves[this.shelf].y + 20;
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
            this.x = shelves[this.shelf].positions[this.position];
            this.y = shelves[this.shelf].y + 15;
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
            this.x = shelves[this.shelf].positions[this.position];
            this.y = shelves[this.shelf].y + 20;
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

Book.prototype.expand = function() {
    // Animate the book expanding from where it is on the bookshelf to the centre of the screen, keeping the text on it in the correct proportions.
    // Do not use `this.draw()`
    this.width = 200;
    this.height = 200;
    this.x = 100;
    this.y = 100;
    fill(this.colour);
    rect(this.x, this.y, this.width, this.height);
    fill(0, 0, 0);
    textSize(12.0);
    text(this.title + "\n\nBy: " + this.author, this.x + 5, this.y + 5, this.width - 10, this.height - 10);
    // Draw stars
    var starWidth = 15;
    var totalStarWidth = this.rating * starWidth;
    var starStart = this.x + ((this.width - totalStarWidth) / 2);
    for (var i = 0; i < this.rating; i++) {
        text("⭐", starStart + i * starWidth, this.y + 105, this.width - 10, this.height - 10);
    }
};


Book.prototype.isMouseInside = function() {
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
        return true;
    } else {
        return false;
    }
};

Book.prototype.handleMouseClick = function() {
    if (this.isMouseInside()) {
        this.onClicked();
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
var rainbowBooks = (random(0, 2) < 0.5) ? true : false;
if (rainbowBooks) {
    var inc = 255 / 72;
    var hueue = 0; // Should limit to 19 to 32 for brown book colours
    inc = (random(0, 1) > 0.5) ? inc : -inc;
    if (inc < 0) {
        hueue = 360;
    }
}

colorMode(HSB, 360);
for (var i = 0; i < 72; i++) {
    var orientation;
    if (rainbowBooks) {
        if (i < 6 || i > 26 && i < 33) {
            orientation = "display";
            displayBooks++;
        } else {
            orientation = "spine";
        }
    } else {
        if (displayBooks < 12) {
            orientation = (random(0, 2) > 0.5) ? "display" : "spine";
            if (orientation === "display") {
                displayBooks++;
            }
        } else {
            orientation = "spine";
        }
    }
    var bookData = fetchBook();
    var book = new Book({
        width: 90,
        height: 100,
        colour: (rainbowBooks) ? color(hueue, 255, 255) : color(random(0, 255), 255, 255),
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

for (var i = 0; i < books.length; i++) {
    books[i].draw();
}

mouseClicked = function() {
    for (var i = 0; i < books.length; i++) {
        books[i].handleMouseClick();
    }
};


var draw = function() {
    for (var i = 0; i < shelves.length; i++) {
        shelves[i].draw();
    }
    for (var i = 0; i < books.length; i++) {
        books[i].draw();
    }
};