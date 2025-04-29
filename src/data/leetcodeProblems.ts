export interface LeetCodeProblem {
  id: string;
  name: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export const problems: LeetCodeProblem[] = [
  {
    id: '36',
    name: 'Valid Sudoku',
    url: 'https://leetcode.com/problems/valid-sudoku/',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Matrix'],
  },
  {
    id: '242',
    name: 'Valid Anagram',
    url: 'https://leetcode.com/problems/valid-anagram/',
    difficulty: 'Easy',
    tags: ['Hash Table', 'String', 'Sorting'],
  },
  {
    id: '1',
    name: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
  },
  {
    id: '347',
    name: 'Top K Frequent Elements',
    url: 'https://leetcode.com/problems/top-k-frequent-elements/',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Sorting', 'Heap'],
  },
  {
    id: '238',
    name: 'Product of Array Except Self',
    url: 'https://leetcode.com/problems/product-of-array-except-self/',
    difficulty: 'Medium',
    tags: ['Array', 'Prefix Sum'],
  },
  {
    id: '128',
    name: 'Longest Consecutive Sequence',
    url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Union Find'],
  },
  {
    id: '49',
    name: 'Group Anagrams',
    url: 'https://leetcode.com/problems/group-anagrams/',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
  },
  {
    id: '271',
    name: 'Encode and Decode Strings',
    url: 'https://leetcode.com/problems/encode-and-decode-strings/',
    difficulty: 'Medium',
    tags: ['String', 'Design'],
  },
  {
    id: '217',
    name: 'Contains Duplicate',
    url: 'https://leetcode.com/problems/contains-duplicate/',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Sorting'],
  },
  // Two Pointers Section
  {
    id: '125',
    name: 'Valid Palindrome',
    url: 'https://leetcode.com/problems/valid-palindrome/',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'String'],
  },
  {
    id: '167',
    name: 'Two Sum II Input Array Is Sorted',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Binary Search'],
  },
  {
    id: '15',
    name: '3Sum',
    url: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
  },
  {
    id: '11',
    name: 'Container With Most Water',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Greedy'],
  },
  {
    id: '121',
    name: 'Best Time to Buy And Sell Stock',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
  },
  {
    id: '3',
    name: 'Longest Substring Without Repeating Characters',
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
  },
  {
    id: '424',
    name: 'Longest Repeating Character Replacement',
    url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window'],
  },
  {
    id: '567',
    name: 'Permutation In String',
    url: 'https://leetcode.com/problems/permutation-in-string/',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Two Pointers', 'String', 'Sliding Window'],
  },
  {
    id: '20',
    name: 'Valid Parentheses',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
  },
  {
    id: '155',
    name: 'Min Stack',
    url: 'https://leetcode.com/problems/min-stack/',
    difficulty: 'Medium',
    tags: ['Stack', 'Design'],
  },
  {
    id: '150',
    name: 'Evaluate Reverse Polish Notation',
    url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    difficulty: 'Medium',
    tags: ['Array', 'Math', 'Stack'],
  },
  {
    id: '22',
    name: 'Generate Parentheses',
    url: 'https://leetcode.com/problems/generate-parentheses/',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming', 'Backtracking'],
  },
  {
    id: '739',
    name: 'Daily Temperatures',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    difficulty: 'Medium',
    tags: ['Array', 'Stack', 'Monotonic Stack'],
  },
  {
    id: '853',
    name: 'Car Fleet',
    url: 'https://leetcode.com/problems/car-fleet/',
    difficulty: 'Medium',
    tags: ['Array', 'Stack', 'Sorting', 'Monotonic Stack'],
  },
  // Binary Search Section
  {
    id: '704',
    name: 'Binary Search',
    url: 'https://leetcode.com/problems/binary-search/',
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
  },
  {
    id: '74',
    name: 'Search a 2D Matrix',
    url: 'https://leetcode.com/problems/search-a-2d-matrix/',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search', 'Matrix'],
  },
  {
    id: '875',
    name: 'Koko Eating Bananas',
    url: 'https://leetcode.com/problems/koko-eating-bananas/',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search'],
  },
  // ... 更多題目將在下一個編輯中繼續添加 ...
] 