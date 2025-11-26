import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface QuestionData {
  questionText: string;
  questionLatex: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  topic: string;
  difficultyLevel: number;
  explanation: string;
}

async function main(): Promise<void> {
  console.log('Starting database seed...');

  // Create test users with hashed passwords
  const passwordHash = await bcrypt.hash('Test123!', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'test1@example.com' },
      update: {},
      create: {
        email: 'test1@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'User One',
        role: 'user',
      },
    }),
    prisma.user.upsert({
      where: { email: 'test2@example.com' },
      update: {},
      create: {
        email: 'test2@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'User Two',
        role: 'user',
      },
    }),
  ]);

  console.log(`Created ${users.length} test users`);

  // Sample questions across all topics
  const questions: QuestionData[] = [
    // Algebra questions (15 questions)
    {
      questionText: 'Solve for x: 2x + 5 = 13',
      questionLatex: '2x + 5 = 13',
      optionA: 'x = 3',
      optionB: 'x = 4',
      optionC: 'x = 5',
      optionD: 'x = 6',
      correctAnswer: 'B',
      topic: 'algebra',
      difficultyLevel: 1,
      explanation:
        'Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.',
    },
    {
      questionText: 'Simplify: 3(x + 2) - 2(x - 1)',
      questionLatex: '3(x + 2) - 2(x - 1)',
      optionA: 'x + 4',
      optionB: 'x + 8',
      optionC: 'x + 6',
      optionD: '5x + 4',
      correctAnswer: 'B',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Expand: 3x + 6 - 2x + 2. Combine like terms: x + 8.',
    },
    {
      questionText: 'What is the value of x² when x = -3?',
      questionLatex: 'x^2 \\text{ when } x = -3',
      optionA: '-9',
      optionB: '9',
      optionC: '-6',
      optionD: '6',
      correctAnswer: 'B',
      topic: 'algebra',
      difficultyLevel: 1,
      explanation:
        'Square of -3 is (-3)² = (-3) × (-3) = 9. Negative times negative equals positive.',
    },
    {
      questionText: 'Factor: x² + 5x + 6',
      questionLatex: 'x^2 + 5x + 6',
      optionA: '(x + 2)(x + 3)',
      optionB: '(x + 1)(x + 6)',
      optionC: '(x - 2)(x - 3)',
      optionD: '(x + 4)(x + 1)',
      correctAnswer: 'A',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Find two numbers that multiply to 6 and add to 5: 2 and 3. Therefore (x + 2)(x + 3).',
    },
    {
      questionText: 'Solve: (x/2) + 3 = 7',
      questionLatex: '\\frac{x}{2} + 3 = 7',
      optionA: 'x = 6',
      optionB: 'x = 8',
      optionC: 'x = 10',
      optionD: 'x = 4',
      correctAnswer: 'B',
      topic: 'algebra',
      difficultyLevel: 1,
      explanation:
        'Subtract 3 from both sides: x/2 = 4. Multiply by 2: x = 8.',
    },
    {
      questionText: 'Simplify: √(16x²)',
      questionLatex: '\\sqrt{16x^2}',
      optionA: '4x',
      optionB: '8x',
      optionC: '4x²',
      optionD: '16x',
      correctAnswer: 'A',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Square root of 16 is 4, square root of x² is x. Result: 4x.',
    },
    {
      questionText: 'If 3x - 7 = 14, what is x?',
      questionLatex: '3x - 7 = 14',
      optionA: 'x = 5',
      optionB: 'x = 6',
      optionC: 'x = 7',
      optionD: 'x = 8',
      correctAnswer: 'C',
      topic: 'algebra',
      difficultyLevel: 1,
      explanation:
        'Add 7 to both sides: 3x = 21. Divide by 3: x = 7.',
    },
    {
      questionText: 'Expand: (x + 3)²',
      questionLatex: '(x + 3)^2',
      optionA: 'x² + 6x + 9',
      optionB: 'x² + 9',
      optionC: 'x² + 3x + 9',
      optionD: 'x² + 6x + 6',
      correctAnswer: 'A',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Use (a + b)² = a² + 2ab + b². Result: x² + 2(3)x + 9 = x² + 6x + 9.',
    },
    {
      questionText: 'Solve for y: 2y/3 = 8',
      questionLatex: '\\frac{2y}{3} = 8',
      optionA: 'y = 10',
      optionB: 'y = 11',
      optionC: 'y = 12',
      optionD: 'y = 13',
      correctAnswer: 'C',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Multiply both sides by 3: 2y = 24. Divide by 2: y = 12.',
    },
    {
      questionText: 'What is the slope of the line y = 3x + 2?',
      questionLatex: 'y = 3x + 2',
      optionA: '2',
      optionB: '3',
      optionC: '5',
      optionD: '1',
      correctAnswer: 'B',
      topic: 'algebra',
      difficultyLevel: 1,
      explanation:
        'In y = mx + b form, m is the slope. Here m = 3.',
    },
    {
      questionText: 'Simplify: 2x² + 3x² - x²',
      questionLatex: '2x^2 + 3x^2 - x^2',
      optionA: '3x²',
      optionB: '4x²',
      optionC: '5x²',
      optionD: '6x²',
      correctAnswer: 'B',
      topic: 'algebra',
      difficultyLevel: 1,
      explanation:
        'Combine like terms: (2 + 3 - 1)x² = 4x².',
    },
    {
      questionText: 'Factor: x² - 9',
      questionLatex: 'x^2 - 9',
      optionA: '(x - 3)(x - 3)',
      optionB: '(x + 3)(x + 3)',
      optionC: '(x - 3)(x + 3)',
      optionD: 'Cannot be factored',
      correctAnswer: 'C',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Difference of squares: a² - b² = (a - b)(a + b). Here: (x - 3)(x + 3).',
    },
    {
      questionText: 'If f(x) = 2x + 1, what is f(3)?',
      questionLatex: 'f(x) = 2x + 1, f(3) = ?',
      optionA: '5',
      optionB: '6',
      optionC: '7',
      optionD: '8',
      correctAnswer: 'C',
      topic: 'algebra',
      difficultyLevel: 1,
      explanation:
        'Substitute x = 3: f(3) = 2(3) + 1 = 6 + 1 = 7.',
    },
    {
      questionText: 'Solve: x² = 25',
      questionLatex: 'x^2 = 25',
      optionA: 'x = 5 only',
      optionB: 'x = -5 only',
      optionC: 'x = ±5',
      optionD: 'x = 25',
      correctAnswer: 'C',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Take square root of both sides: x = ±√25 = ±5.',
    },
    {
      questionText: 'Simplify: (2x³)(3x²)',
      questionLatex: '(2x^3)(3x^2)',
      optionA: '5x⁵',
      optionB: '6x⁵',
      optionC: '6x⁶',
      optionD: '5x⁶',
      correctAnswer: 'B',
      topic: 'algebra',
      difficultyLevel: 2,
      explanation:
        'Multiply coefficients: 2 × 3 = 6. Add exponents: x³⁺² = x⁵. Result: 6x⁵.',
    },

    // Geometry questions (15 questions)
    {
      questionText: 'What is the area of a rectangle with length 8 and width 5?',
      questionLatex: 'A = l \\times w, l = 8, w = 5',
      optionA: '13',
      optionB: '26',
      optionC: '40',
      optionD: '80',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 1,
      explanation:
        'Area of rectangle = length × width = 8 × 5 = 40 square units.',
    },
    {
      questionText: 'What is the perimeter of a square with side length 6?',
      questionLatex: 'P = 4s, s = 6',
      optionA: '12',
      optionB: '18',
      optionC: '24',
      optionD: '36',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 1,
      explanation:
        'Perimeter of square = 4 × side = 4 × 6 = 24 units.',
    },
    {
      questionText: 'What is the area of a circle with radius 3? (Use π ≈ 3.14)',
      questionLatex: 'A = \\pi r^2, r = 3',
      optionA: '9.42',
      optionB: '18.84',
      optionC: '28.26',
      optionD: '37.68',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 2,
      explanation:
        'Area = πr² = 3.14 × 3² = 3.14 × 9 = 28.26 square units.',
    },
    {
      questionText: 'What is the sum of angles in a triangle?',
      questionLatex: '\\text{Sum of angles in triangle}',
      optionA: '90°',
      optionB: '180°',
      optionC: '270°',
      optionD: '360°',
      correctAnswer: 'B',
      topic: 'geometry',
      difficultyLevel: 1,
      explanation:
        'The sum of all interior angles in any triangle is always 180°.',
    },
    {
      questionText: 'What is the area of a triangle with base 10 and height 6?',
      questionLatex: 'A = \\frac{1}{2}bh, b = 10, h = 6',
      optionA: '16',
      optionB: '30',
      optionC: '60',
      optionD: '120',
      correctAnswer: 'B',
      topic: 'geometry',
      difficultyLevel: 1,
      explanation:
        'Area = (1/2) × base × height = (1/2) × 10 × 6 = 30 square units.',
    },
    {
      questionText: 'What is the circumference of a circle with radius 5? (Use π ≈ 3.14)',
      questionLatex: 'C = 2\\pi r, r = 5',
      optionA: '15.7',
      optionB: '25.12',
      optionC: '31.4',
      optionD: '78.5',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 2,
      explanation:
        'Circumference = 2πr = 2 × 3.14 × 5 = 31.4 units.',
    },
    {
      questionText: 'In a right triangle, if one angle is 90° and another is 30°, what is the third angle?',
      questionLatex: '90° + 30° + x = 180°',
      optionA: '45°',
      optionB: '50°',
      optionC: '60°',
      optionD: '70°',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 1,
      explanation:
        'Sum of angles = 180°. Third angle = 180° - 90° - 30° = 60°.',
    },
    {
      questionText: 'What is the volume of a cube with side length 4?',
      questionLatex: 'V = s^3, s = 4',
      optionA: '12',
      optionB: '16',
      optionC: '48',
      optionD: '64',
      correctAnswer: 'D',
      topic: 'geometry',
      difficultyLevel: 2,
      explanation:
        'Volume of cube = side³ = 4³ = 64 cubic units.',
    },
    {
      questionText: 'What is the diagonal of a square with side length 5? (Use √2 ≈ 1.414)',
      questionLatex: 'd = s\\sqrt{2}, s = 5',
      optionA: '5',
      optionB: '7.07',
      optionC: '10',
      optionD: '25',
      correctAnswer: 'B',
      topic: 'geometry',
      difficultyLevel: 3,
      explanation:
        'Diagonal = side × √2 = 5 × 1.414 = 7.07 units.',
    },
    {
      questionText: 'What is the area of a trapezoid with bases 6 and 10, and height 4?',
      questionLatex: 'A = \\frac{1}{2}(b_1 + b_2)h',
      optionA: '28',
      optionB: '32',
      optionC: '36',
      optionD: '40',
      correctAnswer: 'B',
      topic: 'geometry',
      difficultyLevel: 2,
      explanation:
        'Area = (1/2)(b₁ + b₂)h = (1/2)(6 + 10)(4) = (1/2)(16)(4) = 32 square units.',
    },
    {
      questionText: 'How many sides does a hexagon have?',
      questionLatex: '\\text{Hexagon sides}',
      optionA: '5',
      optionB: '6',
      optionC: '7',
      optionD: '8',
      correctAnswer: 'B',
      topic: 'geometry',
      difficultyLevel: 1,
      explanation:
        'A hexagon is a polygon with 6 sides.',
    },
    {
      questionText: 'What is the surface area of a cube with side length 3?',
      questionLatex: 'SA = 6s^2, s = 3',
      optionA: '27',
      optionB: '36',
      optionC: '54',
      optionD: '81',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 2,
      explanation:
        'Surface area = 6 × side² = 6 × 3² = 6 × 9 = 54 square units.',
    },
    {
      questionText: 'What is the volume of a rectangular prism with length 5, width 3, and height 2?',
      questionLatex: 'V = l \\times w \\times h',
      optionA: '10',
      optionB: '15',
      optionC: '30',
      optionD: '60',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 2,
      explanation:
        'Volume = length × width × height = 5 × 3 × 2 = 30 cubic units.',
    },
    {
      questionText: 'What is the measure of each interior angle of a regular pentagon?',
      questionLatex: '\\frac{(n-2) \\times 180°}{n}, n = 5',
      optionA: '90°',
      optionB: '108°',
      optionC: '120°',
      optionD: '135°',
      correctAnswer: 'B',
      topic: 'geometry',
      difficultyLevel: 3,
      explanation:
        'Interior angle = [(n-2) × 180°]/n = [(5-2) × 180°]/5 = 540°/5 = 108°.',
    },
    {
      questionText: 'What is the area of a parallelogram with base 8 and height 5?',
      questionLatex: 'A = b \\times h, b = 8, h = 5',
      optionA: '13',
      optionB: '26',
      optionC: '40',
      optionD: '80',
      correctAnswer: 'C',
      topic: 'geometry',
      difficultyLevel: 2,
      explanation:
        'Area of parallelogram = base × height = 8 × 5 = 40 square units.',
    },

    // Statistics questions (10 questions)
    {
      questionText: 'What is the mean of the numbers: 2, 4, 6, 8, 10?',
      questionLatex: '\\text{Mean} = \\frac{2 + 4 + 6 + 8 + 10}{5}',
      optionA: '5',
      optionB: '6',
      optionC: '7',
      optionD: '8',
      correctAnswer: 'B',
      topic: 'statistics',
      difficultyLevel: 1,
      explanation:
        'Mean = sum of values / count = (2+4+6+8+10)/5 = 30/5 = 6.',
    },
    {
      questionText: 'What is the median of: 3, 7, 2, 9, 5?',
      questionLatex: '\\text{Median of } 3, 7, 2, 9, 5',
      optionA: '3',
      optionB: '5',
      optionC: '7',
      optionD: '9',
      correctAnswer: 'B',
      topic: 'statistics',
      difficultyLevel: 2,
      explanation:
        'Sort the numbers: 2, 3, 5, 7, 9. The middle value (median) is 5.',
    },
    {
      questionText: 'What is the mode of: 2, 3, 3, 4, 5, 5, 5, 6?',
      questionLatex: '\\text{Mode of } 2, 3, 3, 4, 5, 5, 5, 6',
      optionA: '3',
      optionB: '4',
      optionC: '5',
      optionD: '6',
      correctAnswer: 'C',
      topic: 'statistics',
      difficultyLevel: 1,
      explanation:
        'Mode is the most frequently occurring value. 5 appears 3 times, more than any other number.',
    },
    {
      questionText: 'What is the range of: 10, 15, 20, 25, 30?',
      questionLatex: '\\text{Range} = \\text{max} - \\text{min}',
      optionA: '15',
      optionB: '20',
      optionC: '25',
      optionD: '30',
      correctAnswer: 'B',
      topic: 'statistics',
      difficultyLevel: 1,
      explanation:
        'Range = maximum - minimum = 30 - 10 = 20.',
    },
    {
      questionText: 'What is the mean of: 5, 10, 15?',
      questionLatex: '\\text{Mean} = \\frac{5 + 10 + 15}{3}',
      optionA: '8',
      optionB: '9',
      optionC: '10',
      optionD: '11',
      correctAnswer: 'C',
      topic: 'statistics',
      difficultyLevel: 1,
      explanation:
        'Mean = (5 + 10 + 15) / 3 = 30 / 3 = 10.',
    },
    {
      questionText: 'What is the median of: 1, 2, 3, 4, 5, 6?',
      questionLatex: '\\text{Median of } 1, 2, 3, 4, 5, 6',
      optionA: '3',
      optionB: '3.5',
      optionC: '4',
      optionD: '4.5',
      correctAnswer: 'B',
      topic: 'statistics',
      difficultyLevel: 2,
      explanation:
        'For even count, median = average of two middle values = (3 + 4) / 2 = 3.5.',
    },
    {
      questionText: 'If the mean of 4 numbers is 10, what is their sum?',
      questionLatex: '\\text{Mean} = 10, n = 4',
      optionA: '14',
      optionB: '20',
      optionC: '30',
      optionD: '40',
      correctAnswer: 'D',
      topic: 'statistics',
      difficultyLevel: 2,
      explanation:
        'Sum = mean × count = 10 × 4 = 40.',
    },
    {
      questionText: 'What is the mode of: 1, 2, 2, 3, 3, 4?',
      questionLatex: '\\text{Mode of } 1, 2, 2, 3, 3, 4',
      optionA: '1',
      optionB: '2 and 3',
      optionC: '3',
      optionD: 'No mode',
      correctAnswer: 'B',
      topic: 'statistics',
      difficultyLevel: 2,
      explanation:
        'Both 2 and 3 appear twice (most frequent). This is a bimodal distribution.',
    },
    {
      questionText: 'What percentage is 25 out of 100?',
      questionLatex: '\\frac{25}{100} \\times 100\\%',
      optionA: '20%',
      optionB: '25%',
      optionC: '30%',
      optionD: '35%',
      correctAnswer: 'B',
      topic: 'statistics',
      difficultyLevel: 1,
      explanation:
        'Percentage = (part/whole) × 100 = (25/100) × 100 = 25%.',
    },
    {
      questionText: 'If a dataset has values 10, 20, 30, 40, what is the mean?',
      questionLatex: '\\text{Mean} = \\frac{10 + 20 + 30 + 40}{4}',
      optionA: '20',
      optionB: '25',
      optionC: '30',
      optionD: '35',
      correctAnswer: 'B',
      topic: 'statistics',
      difficultyLevel: 1,
      explanation:
        'Mean = (10 + 20 + 30 + 40) / 4 = 100 / 4 = 25.',
    },

    // Probability questions (10 questions)
    {
      questionText: 'What is the probability of flipping heads on a fair coin?',
      questionLatex: 'P(\\text{heads}) = ?',
      optionA: '0',
      optionB: '0.25',
      optionC: '0.5',
      optionD: '1',
      correctAnswer: 'C',
      topic: 'probability',
      difficultyLevel: 1,
      explanation:
        'A fair coin has 2 equally likely outcomes. P(heads) = 1/2 = 0.5.',
    },
    {
      questionText: 'What is the probability of rolling a 3 on a standard die?',
      questionLatex: 'P(3) = ?',
      optionA: '1/6',
      optionB: '1/3',
      optionC: '1/2',
      optionD: '1',
      correctAnswer: 'A',
      topic: 'probability',
      difficultyLevel: 1,
      explanation:
        'A die has 6 faces. Probability of any single number = 1/6.',
    },
    {
      questionText: 'What is the probability of drawing a heart from a standard deck of 52 cards?',
      questionLatex: 'P(\\text{heart}) = ?',
      optionA: '1/13',
      optionB: '1/4',
      optionC: '1/2',
      optionD: '13/52',
      correctAnswer: 'B',
      topic: 'probability',
      difficultyLevel: 2,
      explanation:
        'There are 13 hearts in 52 cards. P(heart) = 13/52 = 1/4.',
    },
    {
      questionText: 'If you flip two coins, what is the probability both are heads?',
      questionLatex: 'P(HH) = ?',
      optionA: '1/2',
      optionB: '1/3',
      optionC: '1/4',
      optionD: '1/8',
      correctAnswer: 'C',
      topic: 'probability',
      difficultyLevel: 2,
      explanation:
        'P(H) = 1/2 for each coin. P(HH) = (1/2) × (1/2) = 1/4.',
    },
    {
      questionText: 'What is the probability of rolling an even number on a die?',
      questionLatex: 'P(\\text{even}) = ?',
      optionA: '1/6',
      optionB: '1/3',
      optionC: '1/2',
      optionD: '2/3',
      correctAnswer: 'C',
      topic: 'probability',
      difficultyLevel: 1,
      explanation:
        'Even numbers on a die: 2, 4, 6 (3 outcomes). P(even) = 3/6 = 1/2.',
    },
    {
      questionText: 'How many ways can you arrange 3 different books?',
      questionLatex: '3! = ?',
      optionA: '3',
      optionB: '6',
      optionC: '9',
      optionD: '12',
      correctAnswer: 'B',
      topic: 'probability',
      difficultyLevel: 2,
      explanation:
        'Number of arrangements = 3! = 3 × 2 × 1 = 6.',
    },
    {
      questionText: 'What is the probability of NOT rolling a 6 on a die?',
      questionLatex: 'P(\\text{not } 6) = ?',
      optionA: '1/6',
      optionB: '1/3',
      optionC: '2/3',
      optionD: '5/6',
      correctAnswer: 'D',
      topic: 'probability',
      difficultyLevel: 1,
      explanation:
        'P(not 6) = 1 - P(6) = 1 - 1/6 = 5/6.',
    },
    {
      questionText: 'If a bag has 3 red and 2 blue marbles, what is P(red)?',
      questionLatex: 'P(\\text{red}) = ?',
      optionA: '2/5',
      optionB: '3/5',
      optionC: '1/2',
      optionD: '3/2',
      correctAnswer: 'B',
      topic: 'probability',
      difficultyLevel: 2,
      explanation:
        'Total marbles = 5. P(red) = 3/5.',
    },
    {
      questionText: 'How many combinations of 2 items from 4 items?',
      questionLatex: 'C(4,2) = \\frac{4!}{2!(4-2)!}',
      optionA: '4',
      optionB: '6',
      optionC: '8',
      optionD: '12',
      correctAnswer: 'B',
      topic: 'probability',
      difficultyLevel: 3,
      explanation:
        'C(4,2) = 4!/(2!×2!) = (4×3)/(2×1) = 6.',
    },
    {
      questionText: 'What is the probability of getting at least one head in two coin flips?',
      questionLatex: 'P(\\text{at least one H}) = ?',
      optionA: '1/4',
      optionB: '1/2',
      optionC: '3/4',
      optionD: '1',
      correctAnswer: 'C',
      topic: 'probability',
      difficultyLevel: 3,
      explanation:
        'P(at least one H) = 1 - P(no heads) = 1 - P(TT) = 1 - 1/4 = 3/4.',
    },

    // Number Systems questions (10 questions)
    {
      questionText: 'Convert binary 1010 to decimal',
      questionLatex: '1010_2 = ?_{10}',
      optionA: '8',
      optionB: '10',
      optionC: '12',
      optionD: '14',
      correctAnswer: 'B',
      topic: 'number_systems',
      difficultyLevel: 2,
      explanation:
        '1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10.',
    },
    {
      questionText: 'Convert decimal 15 to binary',
      questionLatex: '15_{10} = ?_2',
      optionA: '1101',
      optionB: '1110',
      optionC: '1111',
      optionD: '10000',
      correctAnswer: 'C',
      topic: 'number_systems',
      difficultyLevel: 2,
      explanation:
        '15 = 8 + 4 + 2 + 1 = 2³ + 2² + 2¹ + 2⁰ = 1111₂.',
    },
    {
      questionText: 'What is 101₂ + 11₂ in binary?',
      questionLatex: '101_2 + 11_2 = ?',
      optionA: '110₂',
      optionB: '111₂',
      optionC: '1000₂',
      optionD: '1001₂',
      correctAnswer: 'C',
      topic: 'number_systems',
      difficultyLevel: 3,
      explanation:
        '101₂ (5) + 11₂ (3) = 1000₂ (8).',
    },
    {
      questionText: 'Convert hexadecimal A to decimal',
      questionLatex: 'A_{16} = ?_{10}',
      optionA: '9',
      optionB: '10',
      optionC: '11',
      optionD: '12',
      correctAnswer: 'B',
      topic: 'number_systems',
      difficultyLevel: 2,
      explanation:
        'In hexadecimal, A represents 10 in decimal.',
    },
    {
      questionText: 'What is the base of the octal number system?',
      questionLatex: '\\text{Octal base} = ?',
      optionA: '2',
      optionB: '8',
      optionC: '10',
      optionD: '16',
      correctAnswer: 'B',
      topic: 'number_systems',
      difficultyLevel: 1,
      explanation:
        'Octal number system uses base 8 (digits 0-7).',
    },
    {
      questionText: 'Convert binary 1111 to decimal',
      questionLatex: '1111_2 = ?_{10}',
      optionA: '12',
      optionB: '13',
      optionC: '14',
      optionD: '15',
      correctAnswer: 'D',
      topic: 'number_systems',
      difficultyLevel: 2,
      explanation:
        '1111₂ = 1×2³ + 1×2² + 1×2¹ + 1×2⁰ = 8 + 4 + 2 + 1 = 15.',
    },
    {
      questionText: 'What is hexadecimal F in decimal?',
      questionLatex: 'F_{16} = ?_{10}',
      optionA: '14',
      optionB: '15',
      optionC: '16',
      optionD: '17',
      correctAnswer: 'B',
      topic: 'number_systems',
      difficultyLevel: 1,
      explanation:
        'In hexadecimal, F represents 15 in decimal.',
    },
    {
      questionText: 'Convert decimal 8 to binary',
      questionLatex: '8_{10} = ?_2',
      optionA: '100',
      optionB: '1000',
      optionC: '1100',
      optionD: '10000',
      correctAnswer: 'B',
      topic: 'number_systems',
      difficultyLevel: 1,
      explanation:
        '8 = 2³ = 1000₂.',
    },
    {
      questionText: 'What is 10₂ × 11₂ in binary?',
      questionLatex: '10_2 \\times 11_2 = ?',
      optionA: '100₂',
      optionB: '101₂',
      optionC: '110₂',
      optionD: '111₂',
      correctAnswer: 'C',
      topic: 'number_systems',
      difficultyLevel: 3,
      explanation:
        '10₂ (2) × 11₂ (3) = 110₂ (6).',
    },
    {
      questionText: 'Convert octal 12 to decimal',
      questionLatex: '12_8 = ?_{10}',
      optionA: '8',
      optionB: '9',
      optionC: '10',
      optionD: '12',
      correctAnswer: 'C',
      topic: 'number_systems',
      difficultyLevel: 2,
      explanation:
        '12₈ = 1×8¹ + 2×8⁰ = 8 + 2 = 10.',
    },
  ];

  // Insert questions
  const createdQuestions = await prisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  });

  console.log(`Created ${createdQuestions.count} questions`);

  // Create sample UserProgress records for test users
  const topics = [
    'algebra',
    'geometry',
    'statistics',
    'probability',
    'number_systems',
  ];

  const progressRecords = [];
  for (const user of users) {
    for (const topic of topics) {
      progressRecords.push({
        userId: user.id,
        topic,
        questionsAttempted: Math.floor(Math.random() * 20),
        questionsCorrect: Math.floor(Math.random() * 15),
        lastPracticed: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ),
      });
    }
  }

  const createdProgress = await prisma.userProgress.createMany({
    data: progressRecords,
    skipDuplicates: true,
  });

  console.log(`Created ${createdProgress.count} user progress records`);

  // Summary
  console.log('\n=== Seed Summary ===');
  console.log(`Users: ${users.length}`);
  console.log(`Questions: ${createdQuestions.count}`);
  console.log(`User Progress Records: ${createdProgress.count}`);
  console.log('\nTopics covered:');
  const topicCounts = questions.reduce(
    (acc, q) => {
      acc[q.topic] = (acc[q.topic] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  Object.entries(topicCounts).forEach(([topic, count]) => {
    console.log(`  - ${topic}: ${count} questions`);
  });
  console.log('\nDatabase seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });