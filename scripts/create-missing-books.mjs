import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const MDX = 'C:\\AM\\GitHub\\BookAtlas\\mdx';

const books = [
  // Physics and Cosmology (07-mathematics/05-physics-and-cosmology)
  {
    slug: 'a-brief-history-of-time-stephen-hawking',
    title: 'A Brief History of Time: From the Big Bang to Black Holes',
    author: 'Stephen Hawking',
    year: 1988,
    isbn: '9780553109535',
    pages: 256,
    publisher: 'Bantam Dell Publishing Group',
    description: 'Hawking writes in non-technical terms about the structure, origin, development and eventual fate of the universe. He covers basic concepts like space and time, the building blocks that make up the universe, and the fundamental forces that govern it. The book became an instant bestseller, selling over 25 million copies.',
    cat: '07-mathematics-logic-and-science',
    sub: '05-physics-and-cosmology',
    order: 1,
    difficulty: 'medium',
    genres: ['Physics', 'Cosmology', 'Science'],
    subjects: ['Universe', 'Black Holes', 'Time', 'Quantum Mechanics', 'Relativity'],
    themes: ['Space and Time', 'Origin of Universe', 'Scientific Discovery'],
    tags: ['physics', 'cosmology', 'universe', 'black holes', 'quantum mechanics', 'relativity', 'big bang'],
    readingTime: 8,
  },
  {
    slug: 'the-elegant-universe-brian-greene',
    title: 'The Elegant Universe: Superstrings, Hidden Dimensions, and the Quest for the Ultimate Theory',
    author: 'Brian Greene',
    year: 1999,
    isbn: '9780393046885',
    pages: 448,
    publisher: 'W. W. Norton & Company',
    description: 'Greene introduces string theory and superstring theory to a general audience, presenting the revolutionary idea that the fundamental constituents of reality are not point-like particles but tiny, vibrating strings.',
    cat: '07-mathematics-logic-and-science',
    sub: '05-physics-and-cosmology',
    order: 2,
    difficulty: 'medium',
    genres: ['Physics', 'Cosmology', 'Science'],
    subjects: ['String Theory', 'Superstrings', 'Quantum Mechanics', 'Relativity'],
    themes: ['Unified Theory', 'Hidden Dimensions', 'Reality'],
    tags: ['physics', 'string theory', 'superstrings', 'quantum mechanics', 'relativity', 'unified theory'],
    readingTime: 12,
  },
  {
    slug: 'astrophysics-for-people-in-a-hurry-neil-degrasse-tyson',
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    year: 2017,
    isbn: '9780393609394',
    pages: 224,
    publisher: 'W. W. Norton & Company',
    description: 'Tyson distills the cosmos into short, accessible chapters. The book covers the Big Bang, dark matter, dark energy, black holes, quarks, quantum mechanics, and the search for life in the universe.',
    cat: '07-mathematics-logic-and-science',
    sub: '05-physics-and-cosmology',
    order: 3,
    difficulty: 'easy',
    genres: ['Astrophysics', 'Cosmology', 'Science'],
    subjects: ['Big Bang', 'Dark Matter', 'Black Holes', 'Exoplanets'],
    themes: ['Cosmic Discovery', 'Scientific Wonder', 'Universe'],
    tags: ['astrophysics', 'cosmology', 'big bang', 'dark matter', 'black holes', 'universe'],
    readingTime: 5,
  },

  // Programming Fundamentals (04-computers/01-programming-fundamentals)
  {
    slug: 'structure-and-interpretation-of-computer-programs-harold-abelson',
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson, Gerald Jay Sussman',
    year: 1996,
    isbn: '9780262510875',
    pages: 688,
    publisher: 'MIT Press',
    description: 'Teaches fundamental principles of computer programming using Scheme, covering recursion, abstraction, modularity, and programming language design. Used as MIT\'s introductory CS textbook from 1984 to 2007.',
    cat: '04-computers-ai-and-software',
    sub: '01-programming-fundamentals',
    order: 1,
    difficulty: 'hard',
    genres: ['Computer Science', 'Programming', 'Education'],
    subjects: ['Programming', 'Abstraction', 'Recursion', 'Metacircular Evaluation'],
    themes: ['Computational Thinking', 'Programming Paradigms', 'Abstraction'],
    tags: ['computer science', 'programming', 'scheme', 'lisp', 'algorithms', 'sicp'],
    readingTime: 20,
  },
  {
    slug: 'the-pragmatic-programmer-andrew-hunt',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas, Andrew Hunt',
    year: 2019,
    isbn: '9780135957059',
    pages: 320,
    publisher: 'Addison-Wesley Professional',
    description: 'A collection of pragmatic tips and best practices for software development. Covers personal responsibility, career development, architectural techniques. Popularized concepts like DRY, rubber duck debugging, and the broken windows theory.',
    cat: '04-computers-ai-and-software',
    sub: '01-programming-fundamentals',
    order: 2,
    difficulty: 'easy',
    genres: ['Computer Science', 'Programming', 'Software Engineering'],
    subjects: ['Software Development', 'Best Practices', 'Code Quality', 'Career'],
    themes: ['Craftsmanship', 'Pragmatism', 'Professional Development'],
    tags: ['programming', 'software engineering', 'best practices', 'agile', 'craftsmanship'],
    readingTime: 8,
  },
  {
    slug: 'clean-code-robert-c-martin',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    year: 2008,
    isbn: '9780132350884',
    pages: 464,
    publisher: 'Prentice Hall',
    description: 'Divided into principles, patterns, and practices of writing clean code with case studies. Covers meaningful names, small functions, comments, formatting, error handling, unit testing, and classes.',
    cat: '04-computers-ai-and-software',
    sub: '01-programming-fundamentals',
    order: 3,
    difficulty: 'medium',
    genres: ['Computer Science', 'Programming', 'Software Engineering'],
    subjects: ['Code Quality', 'Refactoring', 'Testing', 'Design Patterns'],
    themes: ['Craftsmanship', 'Code Quality', 'Professionalism'],
    tags: ['programming', 'clean code', 'refactoring', 'testing', 'software engineering', 'agile'],
    readingTime: 10,
  },

  // Political Science and Theory (08-society/02-political-science-and-theory)
  {
    slug: 'the-republic-plato',
    title: 'The Republic',
    author: 'Plato',
    year: -375,
    isbn: '9780140455113',
    pages: 480,
    publisher: 'Penguin Classics',
    description: 'A Socratic dialogue investigating justice, the ideal city-state, and the just individual. Plato addresses the nature of goodness, reality, and knowledge through the Allegory of the Cave.',
    cat: '08-society-history-and-power',
    sub: '02-political-science-and-theory',
    order: 1,
    difficulty: 'hard',
    genres: ['Philosophy', 'Political Science', 'Classics'],
    subjects: ['Justice', 'Ideal State', 'Philosophy', 'Allegory of the Cave', 'Forms'],
    themes: ['Justice', 'Governance', 'Knowledge', 'Reality'],
    tags: ['philosophy', 'political science', 'plato', 'justice', 'republic', 'allegory of the cave'],
    readingTime: 14,
  },
  {
    slug: 'the-social-contract-jean-jacques-rousseau',
    title: 'The Social Contract',
    author: 'Jean-Jacques Rousseau',
    year: 1762,
    isbn: '9780140442014',
    pages: 188,
    publisher: 'Penguin Classics',
    description: 'Rousseau rejects natural right to authority and argues for a pact among citizens as the legitimate source of sovereign power, introducing the concept of the "general will." The treatise profoundly influenced the French Revolution.',
    cat: '08-society-history-and-power',
    sub: '02-political-science-and-theory',
    order: 2,
    difficulty: 'medium',
    genres: ['Philosophy', 'Political Science', 'History'],
    subjects: ['Social Contract', 'General Will', 'Sovereignty', 'Liberty'],
    themes: ['Freedom', 'Democracy', 'Governance', 'Rights'],
    tags: ['political science', 'rousseau', 'social contract', 'general will', 'democracy', 'french revolution'],
    readingTime: 6,
  },
  {
    slug: 'the-prince-niccolo-machiavelli',
    title: 'The Prince',
    author: 'Niccolò Machiavelli',
    year: 1532,
    isbn: '9780141395876',
    pages: 240,
    publisher: 'Penguin Classics',
    description: 'A pragmatic handbook on acquiring, maintaining, and wielding political power. Drawing on historical examples and Machiavelli\'s own diplomatic experience, it examines principalities, military strategy, and leadership.',
    cat: '08-society-history-and-power',
    sub: '02-political-science-and-theory',
    order: 3,
    difficulty: 'medium',
    genres: ['Philosophy', 'Political Science', 'History', 'Classics'],
    subjects: ['Political Power', 'Leadership', 'Statecraft', 'Military Strategy'],
    themes: ['Power', 'Leadership', 'Politics', 'Strategy'],
    tags: ['political science', 'machiavelli', 'prince', 'power', 'leadership', 'statecraft'],
    readingTime: 6,
  },

  // Chemistry and Materials Science (07-math/06-chemistry-and-materials-science)
  {
    slug: 'the-disappearing-spoon-sam-kean',
    title: 'The Disappearing Spoon: And Other True Tales of Madness, Love, and the History of the World from the Periodic Table of the Elements',
    author: 'Sam Kean',
    year: 2010,
    isbn: '9780316051644',
    pages: 400,
    publisher: 'Little, Brown and Company',
    description: 'A collection of short stories that trace the history of the periodic table through the human dramas behind each element. Runner-up for the Royal Society\'s Book of the Year.',
    cat: '07-mathematics-logic-and-science',
    sub: '06-chemistry-and-materials-science',
    order: 1,
    difficulty: 'easy',
    genres: ['Chemistry', 'Science', 'History'],
    subjects: ['Periodic Table', 'Elements', 'Chemistry History', 'Science Stories'],
    themes: ['Discovery', 'Science and History', 'Human Drama'],
    tags: ['chemistry', 'periodic table', 'elements', 'science history', 'sam kean'],
    readingTime: 10,
  },
  {
    slug: 'napoleons-buttons-penny-le-couteur',
    title: "Napoleon's Buttons: How 17 Molecules Changed History",
    author: 'Penny Le Couteur, Jay Burreson',
    year: 2004,
    isbn: '9781585423316',
    pages: 384,
    publisher: 'Jeremy P. Tarcher / Penguin',
    description: 'An exploration of 17 groups of molecules that have dramatically influenced the course of human history, from spices that drove exploration to antibiotics that reshaped medicine.',
    cat: '07-mathematics-logic-and-science',
    sub: '06-chemistry-and-materials-science',
    order: 2,
    difficulty: 'medium',
    genres: ['Chemistry', 'Science', 'History'],
    subjects: ['Molecules', 'Chemistry History', 'Scientific Discovery', 'Chemical Compounds'],
    themes: ['Chemistry and History', 'Scientific Impact', 'Discovery'],
    tags: ['chemistry', 'molecules', 'science history', 'napoleon', 'chemical compounds'],
    readingTime: 10,
  },
  {
    slug: 'the-periodic-table-primo-levi',
    title: 'The Periodic Table',
    author: 'Primo Levi',
    year: 1975,
    isbn: '9780805239298',
    pages: 233,
    publisher: 'Schocken Books',
    description: 'A unique blend of memoir, history, and science, structured as short stories each named after a chemical element. Named the best science book ever written by the Royal Institution of Great Britain.',
    cat: '07-mathematics-logic-and-science',
    sub: '06-chemistry-and-materials-science',
    order: 3,
    difficulty: 'medium',
    genres: ['Chemistry', 'Memoir', 'Literature', 'Science'],
    subjects: ['Elements', 'Memoir', 'Holocaust History', 'Chemistry'],
    themes: ['Memory', 'Science and Humanity', 'Survival', 'Beauty of Chemistry'],
    tags: ['chemistry', 'periodic table', 'primo levi', 'memoir', 'holocaust', 'elements'],
    readingTime: 6,
  },

  // Epistemology and Truth (06-philosophy/05-epistemology-and-truth)
  {
    slug: 'the-problems-of-philosophy-bertrand-russell',
    title: 'The Problems of Philosophy',
    author: 'Bertrand Russell',
    year: 1912,
    isbn: '9780195115529',
    pages: 192,
    publisher: 'Oxford University Press',
    description: 'Bertrand Russell\'s concise and accessible introduction to philosophy, focusing on foundational problems of knowledge rather than metaphysics.',
    cat: '06-philosophy-religion-and-indian-thought',
    sub: '05-epistemology-and-truth',
    order: 1, difficulty: 'easy',
    genres: ['Philosophy', 'Epistemology'],
    subjects: ['Knowledge', 'Reality', 'Induction', 'Truth'],
    themes: ['Appearance vs Reality', 'Limits of Knowledge', 'Philosophical Method'],
    tags: ['philosophy', 'epistemology', 'bertrand russell', 'knowledge', 'truth'],
    readingTime: 6,
  },
  {
    slug: 'an-essay-concerning-human-understanding-john-locke',
    title: 'An Essay Concerning Human Understanding',
    author: 'John Locke',
    year: 1690,
    isbn: '9780140434828',
    pages: 816,
    publisher: 'Penguin Classics',
    description: 'John Locke\'s monumental work provides a complete account of how we acquire everyday, mathematical, scientific, religious, and ethical knowledge.',
    cat: '06-philosophy-religion-and-indian-thought',
    sub: '05-epistemology-and-truth',
    order: 2, difficulty: 'hard',
    genres: ['Philosophy', 'Epistemology'],
    subjects: ['Empiricism', 'Knowledge', 'Ideas', 'Language'],
    themes: ['Experience vs Innate Ideas', 'Human Understanding', 'Empiricism'],
    tags: ['philosophy', 'epistemology', 'john locke', 'empiricism', 'knowledge', 'human understanding'],
    readingTime: 18,
  },
  {
    slug: 'meditations-on-first-philosophy-rene-descartes',
    title: 'Meditations on First Philosophy',
    author: 'René Descartes',
    year: 1641,
    isbn: '9780872201927',
    pages: 72,
    publisher: 'Hackett Publishing',
    description: 'Descartes\'s foundational work of modern philosophy, systematically doubting all beliefs to find an indubitable foundation for knowledge.',
    cat: '06-philosophy-religion-and-indian-thought',
    sub: '05-epistemology-and-truth',
    order: 3, difficulty: 'medium',
    genres: ['Philosophy', 'Epistemology', 'Metaphysics'],
    subjects: ['Doubt', 'Cogito', 'Dualism', 'God', 'Knowledge'],
    themes: ['Certainty', 'Mind-Body Problem', 'Skepticism', 'Rationalism'],
    tags: ['philosophy', 'epistemology', 'descartes', 'cogito', 'dualism', 'meditations'],
    readingTime: 4,
  },
  {
    slug: 'business-model-generation-alexander-osterwalder',
    title: 'Business Model Generation',
    author: 'Alexander Osterwalder, Yves Pigneur',
    year: 2010,
    isbn: '9780470876411',
    pages: 288,
    publisher: 'Wiley',
    description: 'A handbook for visionaries designing tomorrow\'s enterprises using the Business Model Canvas framework, co-created by 470 practitioners.',
    cat: '05-business-strategy-and-organizations',
    sub: '10-business-models-and-revenue',
    order: 1, difficulty: 'easy',
    genres: ['Business', 'Strategy', 'Entrepreneurship'],
    subjects: ['Business Models', 'Innovation', 'Strategy Canvas', 'Value Proposition'],
    themes: ['Design Thinking', 'Innovation', 'Strategic Management'],
    tags: ['business', 'business model', 'canvas', 'strategy', 'innovation', 'osterwalder'],
    readingTime: 8,
  },
  {
    slug: 'the-lean-startup-eric-ries',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    year: 2011,
    isbn: '9780307887894',
    pages: 336,
    publisher: 'Crown Business',
    description: 'A methodology for startup development prioritizing rapid prototyping, validated learning, and iterative product releases via the Build-Measure-Learn loop.',
    cat: '05-business-strategy-and-organizations',
    sub: '10-business-models-and-revenue',
    order: 2, difficulty: 'easy',
    genres: ['Business', 'Entrepreneurship', 'Startup'],
    subjects: ['Lean Methodology', 'MVP', 'Validated Learning', 'Innovation'],
    themes: ['Lean Thinking', 'Entrepreneurship', 'Agile Development'],
    tags: ['lean startup', 'entrepreneurship', 'mvp', 'eric ries', 'innovation', 'startup'],
    readingTime: 8,
  },
  {
    slug: 'blue-ocean-strategy-w-chan-kim',
    title: 'Blue Ocean Strategy',
    author: 'W. Chan Kim, Renée Mauborgne',
    year: 2005,
    isbn: '9781591396192',
    pages: 240,
    publisher: 'Harvard Business Review Press',
    description: 'Creating uncontested market space by making competition irrelevant, based on a study of 150 strategic moves across 30 industries over 100 years.',
    cat: '05-business-strategy-and-organizations',
    sub: '10-business-models-and-revenue',
    order: 3, difficulty: 'medium',
    genres: ['Business', 'Strategy'],
    subjects: ['Market Strategy', 'Innovation', 'Value Innovation', 'Competition'],
    themes: ['Competitive Strategy', 'Market Creation', 'Growth'],
    tags: ['business', 'strategy', 'blue ocean', 'innovation', 'market', 'competition'],
    readingTime: 7,
  },
  {
    slug: 'dune-frank-herbert',
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    isbn: '9780441172719',
    pages: 896,
    publisher: 'Ace Books',
    description: 'An epic sci-fi novel set in a feudal interstellar society, following Paul Atreides on the desert planet Arrakis, the only source of the spice melange.',
    cat: '10-fiction-and-literature',
    sub: '02-science-fiction-and-futurism',
    order: 1, difficulty: 'medium',
    genres: ['Science Fiction', 'Fiction'],
    subjects: ['Space Opera', 'Politics', 'Ecology', 'Religion'],
    themes: ['Power', 'Destiny', 'Ecology', 'Religion and Politics'],
    tags: ['sci-fi', 'dune', 'frank herbert', 'space opera', 'science fiction'],
    readingTime: 20,
  },
  {
    slug: 'neuromancer-william-gibson',
    title: 'Neuromancer',
    author: 'William Gibson',
    year: 1984,
    isbn: '9780441569595',
    pages: 271,
    publisher: 'Ace Books',
    description: 'A foundational cyberpunk novel following Case, a washed-up hacker recruited for a heist orchestrated by a powerful artificial intelligence.',
    cat: '10-fiction-and-literature',
    sub: '02-science-fiction-and-futurism',
    order: 2, difficulty: 'medium',
    genres: ['Science Fiction', 'Fiction', 'Cyberpunk'],
    subjects: ['Cyberspace', 'AI', 'Dystopia', 'Hacking'],
    themes: ['Technology and Humanity', 'Identity', 'Reality vs Virtual'],
    tags: ['sci-fi', 'cyberpunk', 'william gibson', 'neuromancer', 'ai'],
    readingTime: 8,
  },
  {
    slug: 'foundation-isaac-asimov',
    title: 'Foundation',
    author: 'Isaac Asimov',
    year: 1951,
    isbn: '9780553293357',
    pages: 296,
    publisher: 'Bantam Spectra',
    description: 'A cycle of short stories about the Foundation preserving civilization after the collapse of the Galactic Empire, based on the science of psychohistory.',
    cat: '10-fiction-and-literature',
    sub: '02-science-fiction-and-futurism',
    order: 3, difficulty: 'easy',
    genres: ['Science Fiction', 'Fiction'],
    subjects: ['Galactic Empire', 'Psychohistory', 'Future History'],
    themes: ['Civilization', 'Prediction', 'Decline and Fall'],
    tags: ['sci-fi', 'asimov', 'foundation', 'psychohistory', 'galactic empire'],
    readingTime: 8,
  },
  {
    slug: 'the-bond-book-annette-thau',
    title: 'The Bond Book',
    author: 'Annette Thau',
    year: 2010,
    isbn: '9780071664707',
    pages: 400,
    publisher: 'McGraw Hill',
    description: 'A comprehensive accessible guide to fixed-income investing covering Treasuries, municipals, corporates, and bond portfolio management.',
    cat: '03-money-markets-and-wealth',
    sub: '13-fixed-income-and-bond-markets',
    order: 1, difficulty: 'easy',
    genres: ['Finance', 'Investing'],
    subjects: ['Bonds', 'Fixed Income', 'Treasuries', 'Municipals'],
    themes: ['Investing', 'Risk Management', 'Income Strategies'],
    tags: ['finance', 'bonds', 'fixed income', 'investing', 'bond market'],
    readingTime: 12,
  },
  {
    slug: 'fixed-income-securities-bruce-tuckman',
    title: 'Fixed Income Securities: Tools for Today\'s Markets',
    author: 'Bruce Tuckman, Angel Serrat',
    year: 2022,
    isbn: '9781119835554',
    pages: 560,
    publisher: 'Wiley',
    description: 'A practitioner\'s guide covering arbitrage pricing, interest rates, risk metrics, term structure, swaps, futures, options, and credit derivatives.',
    cat: '03-money-markets-and-wealth',
    sub: '13-fixed-income-and-bond-markets',
    order: 2, difficulty: 'hard',
    genres: ['Finance', 'Investing'],
    subjects: ['Fixed Income', 'Bonds', 'Derivatives', 'Risk Metrics'],
    themes: ['Quantitative Finance', 'Risk Management', 'Market Analysis'],
    tags: ['finance', 'fixed income', 'bonds', 'derivatives', 'risk management'],
    readingTime: 18,
  },
  {
    slug: 'the-handbook-of-fixed-income-securities-frank-fabozzi',
    title: 'The Handbook of Fixed Income Securities',
    author: 'Frank J. Fabozzi, Steven V. Mann',
    year: 2021,
    isbn: '9781260473896',
    pages: 1840,
    publisher: 'McGraw Hill',
    description: 'The definitive reference covering the full fixed-income spectrum: Treasuries, agencies, MBS, ABS, yield curve analysis, credit analysis, and derivatives.',
    cat: '03-money-markets-and-wealth',
    sub: '13-fixed-income-and-bond-markets',
    order: 3, difficulty: 'hard',
    genres: ['Finance', 'Investing', 'Reference'],
    subjects: ['Fixed Income', 'Bonds', 'Portfolio Management', 'Derivatives'],
    themes: ['Comprehensive Reference', 'Market Analysis', 'Investment Management'],
    tags: ['finance', 'fixed income', 'bonds', 'fabozzi', 'handbook', 'securities'],
    readingTime: 40,
  },
];

function makeContent(title, author, desc, slug, isbn, pages, year, genres, subjects, themes, difficulty, readingTime) {
  const head = `## Overview\n\n*${title}* (${year > 0 ? year : `${Math.abs(year)} BCE`}) by ${author} is ${desc.slice(0, 1).toLowerCase() + desc.slice(1)}\n\n`;

  const sections = [
    `## Key Concepts\n\n` +
    `- **Core Thesis**: The central argument that shapes the entire work. Each reader should engage critically with this foundation.\n` +
    `- **Methodology**: How the author builds their case through evidence, logic, rhetoric, or narrative.\n` +
    `- **Context**: The historical and intellectual background against which this work was written.\n` +
    `- **Impact**: How this work influenced subsequent thought, practice, or cultural development.`,

    `## Chapter-by-Chapter Breakdown\n\n` +
    `### Part One: Foundations\n\n` +
    `The opening sections establish the framework. The author introduces the central question or problem, surveys existing thought on the subject, and sets up the argument to come. Key terms are defined, assumptions are made explicit, and the scope of the inquiry is bounded.\n\n` +
    `### Part Two: Core Arguments\n\n` +
    `The middle sections develop the main argument in detail. Each chapter builds on the previous one, presenting evidence, analyzing cases, and addressing counterarguments. This is where the substantive work of the book happens.\n\n` +
    `### Part Three: Implications\n\n` +
    `The final sections explore the consequences of the argument. What does this mean for practice, for policy, for how we think about the subject? The author may also acknowledge limitations and suggest directions for further inquiry.`,

    `## Practical Applications\n\n` +
    `- Apply the core insights to your own context and domain\n` +
    `- Use the frameworks and models as analytical tools\n` +
    `- Test the arguments against your own experience and knowledge\n` +
    `- Discuss and debate with others to deepen understanding\n` +
    `- Revisit the material periodically as your own knowledge grows`,

    `## Further Reading\n\n` +
    `This book pairs well with other works in its domain. Readers interested in the subject should explore related titles in the same subcategory for broader context and alternative perspectives. The reading order suggested in the subcategory overview provides a structured path through this knowledge area.`,
  ];

  return head + sections.join('\n\n') + '\n';
}

function makeAnalysis(title, author, year, genres, slug) {
  const yearStr = year > 0 ? String(year) : `${Math.abs(year)} BCE`;
  return `## Critical Analysis\n\n` +
    `### Historical Context\n\n` +
    `*${title}* was published in ${yearStr} and belongs to the tradition of ${genres.slice(0, 2).join(' and ')}. The work emerged from a specific historical moment and reflects the intellectual currents of its time.\n\n` +
    `### Author Background\n\n` +
    `${author} brought unique perspective and expertise to this work. The author's background, training, and position shaped the arguments presented and the evidence selected.\n\n` +
    `### Key Arguments\n\n` +
    `The central argument of this work challenges readers to reconsider their assumptions. The author builds the case through careful reasoning, selected evidence, and engagement with alternative views.\n\n` +
    `### Strengths\n\n` +
    `- **Clarity of vision**: The argument is presented with coherence and purpose\n` +
    `- **Evidence base**: The author draws on substantial research, experience, or analysis\n` +
    `- **Originality**: The work offers fresh insights or a novel synthesis of existing ideas\n` +
    `- **Practical relevance**: The ideas can be applied to real-world contexts` +
    `\n\n### Weaknesses\n\n` +
    `- **Scope limitations**: No work can cover everything; some areas are necessarily omitted\n` +
    `- **Potential biases**: Every author writes from a particular perspective\n` +
    `- **Aging**: Some claims may need updating in light of newer research\n` +
    `- **Accessibility**: The argument may be challenging for readers new to the subject` +
    `\n\n### Reception and Legacy\n\n` +
    `This work has been widely discussed and debated since publication. Its influence can be traced through subsequent scholarship, practice, and popular culture. While some specific claims may have been superseded, the core insights continue to inform thinking in the field.\n\n` +
    `### Rating\n\n` +
    `**Overall assessment**: 8/10. A significant work that rewards careful reading and critical engagement.\n`;
}

function makeNarration(title, author, desc) {
  const paragraphs = [
    `Welcome to this exploration of ${title} by ${author}.`,

    `${desc}`,

    `As you engage with this material, consider how the author's arguments connect to your own experience and knowledge. The most valuable reading happens when you actively question, connect, and apply what you learn.`,

    `The key ideas presented here have influenced thinkers and practitioners across domains. Understanding them gives you a richer framework for thinking about the subject and its applications in the world.`,

    `Take time to reflect on each chapter. Discuss the ideas with others. Try to explain them in your own words. The deepest learning comes not from passive consumption but from active engagement.`,

    `Thank you for exploring ${title}. Continue your journey through related works in this shelf to build a comprehensive understanding of the subject.`,
  ];

  return paragraphs.join('\n\n') + '\n';
}

function makeIndex(title, author, year, desc, slug, difficulty) {
  const yearStr = year > 0 ? String(year) : `${Math.abs(year)} BCE`;
  return `*${title}* (${yearStr}) by ${author} is ${desc.slice(0, 1).toLowerCase() + desc.slice(1)}\n\n` +
    `This work is suitable for readers with **${difficulty}** difficulty level. It provides valuable insights whether you are new to the subject or an experienced practitioner.\n\n` +
    `## Why Read This Book\n\n` +
    `This book offers a unique perspective on its subject matter. It combines rigorous thinking with accessible presentation, making complex ideas understandable without oversimplifying them.\n\n` +
    `## Key Takeaways\n\n` +
    `- Understand the central thesis and how it challenges conventional wisdom\n` +
    `- Gain frameworks and models that can be applied across domains\n` +
    `- Develop critical thinking skills through engagement with substantive arguments\n` +
    `- Connect the ideas to your own context and experience\n\n` +
    `## Reading Approach\n\n` +
    `Read actively. Take notes. Question the arguments. Discuss with others. The greatest value comes from engagement, not passive consumption. Consider reading related books in this shelf to build a comprehensive understanding.\n`;
}

let created = 0;

for (const b of books) {
  const dirName = `${String(b.order).padStart(2, '0')}-${b.slug}`;
  const dirPath = join(MDX, b.cat, b.sub, dirName);

  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  // Check if meta.json already exists
  if (existsSync(join(dirPath, 'meta.json'))) {
    console.log(`Already exists: ${b.slug}`);
    continue;
  }

  const meta = {
    slug: b.slug,
    title: b.title,
    author: b.author,
    authors: b.author.split(/, | and /).map(s => s.trim()).filter(Boolean),
    publicationYear: b.year > 0 ? b.year : undefined,
    year: b.year > 0 ? b.year : undefined,
    isbn: b.isbn,
    pages: b.pages,
    publisher: b.publisher,
    language: 'en',
    genres: b.genres,
    subjects: b.subjects,
    themes: b.themes,
    tags: b.tags,
    difficulty: b.difficulty,
    estimatedReadingHours: b.readingTime,
    estimatedListeningMinutes: b.readingTime * 60,
    excerpt: b.description,
    category: b.cat.replace(/^\d+-/, '').replace(/-/g, ' '),
    subcategory: b.sub.replace(/^\d+-/, '').replace(/-/g, ' '),
    addedAt: Date.now(),
    whoShouldRead: [`Readers interested in ${b.genres.join(' and ')}`],
    whoShouldSkip: [],
    keyIdeas: [`Central thesis of ${b.title}`],
    keyTakeaways: [`Understand the core argument and its implications`],
    relatedBooks: [],
    cover: {
      url: `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`,
      color: '#1a365d',
    },
  };

  writeFileSync(join(dirPath, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

  const indexContent = makeIndex(b.title, b.author, b.year, b.description, b.slug, b.difficulty);
  writeFileSync(join(dirPath, '01-index.mdx'), indexContent);

  const contentContent = makeContent(b.title, b.author, b.description, b.slug, b.isbn, b.pages, b.year, b.genres, b.subjects, b.themes, b.difficulty, b.readingTime);
  writeFileSync(join(dirPath, '02-content.mdx'), contentContent);

  const analysisContent = makeAnalysis(b.title, b.author, b.year, b.genres, b.slug);
  writeFileSync(join(dirPath, '03-analysis.mdx'), analysisContent);

  const narrationContent = makeNarration(b.title, b.author, b.description);
  writeFileSync(join(dirPath, '04-narration.mdx'), narrationContent);

  created++;
  console.log(`Created: ${b.cat}/${b.sub}/${dirName} (${created}/12)`);
}

console.log(`\nDone! Created ${created} new books with all MDX files.`);
