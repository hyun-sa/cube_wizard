export class HalsteadComplexityAnalyzer {
    // Operators for Python code 파이썬 연산자
    private static pythonOperators = new Set([
      '+', '-', '*', '/', '//', '%', '**',
      '==', '!=', '<', '>', '<=', '>=',
      '=', '+=', '-=', '*=', '/=', '//=', '%=', '**=',
      'and', 'or', 'not', 'in', 'is', 'not in', 'is not', 
      '&', '|', '^', '~', '<<', '>>', 
      '@',
    ]);
    
    // Operators for JavaScript code 자바스크립트 연산자
    private static jsOperators = new Set([
      '+', '-', '*', '/', '%',
      '==', '===', '!=', '!==', '<', '>', '<=', '>=',
      '=', '+=', '-=', '*=', '/=', '%=',
      '&&', '||', '!',
      '&', '|', '^', '~', '<<', '>>', '>>>',
      '++', '--', 
      'typeof', 'instanceof', 'in', 
      '?', ':',
      '...',
      '=>', 
    ]);
  
    private code: string;
    private language: 'python' | 'javascript';
  
    constructor(code: string, language: 'python' | 'javascript') {
      this.code = code;
      this.language = language;
    }
  
    public analyze(): {metrics: HalsteadMetrics, complexity: ComplexityMetrics} {
      const metrics = this.calculateHalsteadMetrics();
      const complexity = this.calculateComplexity(metrics);
      return { metrics, complexity };
    }
  
    private calculateHalsteadMetrics(): HalsteadMetrics {
      const tokens = this.tokenize();
      
      const operators = new Set<string>();
      const operands = new Set<string>();
      let totalOperators = 0;
      let totalOperands = 0;
  
      for (const token of tokens) {
        if (this.isOperator(token)) {
          operators.add(token);
          totalOperators++;
        } else {
          operands.add(token);
          totalOperands++;
        }
      }
  
      return {
        n1: operators.size,
        n2: operands.size,
        N1: totalOperators,
        N2: totalOperands
      };
    }
  
    private calculateComplexity(metrics: HalsteadMetrics): ComplexityMetrics {
      const n = metrics.n1 + metrics.n2;
      const N = metrics.N1 + metrics.N2;
      
      const programVolume = N * Math.log2(n);
      const difficulty = (metrics.n1 / 2) * (metrics.N2 / metrics.n2);
      const effort = difficulty * programVolume;
  
      return {
        programLength: N,
        vocabulary: n,
        volume: programVolume,
        difficulty: difficulty,
        effort: effort,
        time: effort / 18,
        bugs: Math.pow(effort, 2/3) / 3000
      };
    }
    
    // 토큰 분리
    private tokenize(): string[] {
      if (this.language === 'python') {
        return this.tokenizePython();
      } else {
        return this.tokenizeJavaScript();
      }
    }
    
    private tokenizePython(): string[] {
      const tokens: string[] = [];
      const regex = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\w+\b|[+\-*/%@=<>!&|^~]+|[\(\)\[\]\{\},:;]|\s+|#.*)/g;
      let match;
  
      while ((match = regex.exec(this.code)) !== null) {
        const token = match[0].trim();
        if (token !== '' && !token.startsWith('#')) {
          tokens.push(token);
        }
      }
  
      return tokens;
    }
  
    private tokenizeJavaScript(): string[] {
      const tokens: string[] = [];
      const regex = /(\/\/.*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\w+\b|[+\-*/%=<>!&|^~?:]+|[\(\)\[\]\{\},.;]|\s+)/g;
      let match;
  
      while ((match = regex.exec(this.code)) !== null) {
        const token = match[0].trim();
        if (token !== '' && !token.startsWith('//') && !token.startsWith('/*')) {
          tokens.push(token);
        }
      }
  
      return tokens;
    }
  
    private isOperator(token: string): boolean {
      if (this.language === 'python') {
        return HalsteadComplexityAnalyzer.pythonOperators.has(token);
      } else {
        return HalsteadComplexityAnalyzer.jsOperators.has(token);
      }
    }
  }
  
  interface HalsteadMetrics {
    n1: number; // 고유 연산자 수
    n2: number; // 고유 피연산자 수
    N1: number; // 총 연산자 수
    N2: number; // 총 피연산자 수
    }
  
  interface ComplexityMetrics {
    programLength: number;
    vocabulary: number;
    volume: number;
    difficulty: number;
    effort: number;
    time: number;
    bugs: number;
  }
  
  // Test code for HalsteadComplexityAnalyzer
  const pythonCode = `
  def greet(name):
      print(f"Hello, {name}!")
  `;
  
  const jsCode = `
  function greet(name) {
      console.log(\`Hello, \${name}!\`);
  }
  `;
  

// Test for HalsteadComplexityAnalyzer
//   const pythonAnalyzer = new HalsteadComplexityAnalyzer(pythonCode, 'python');
//   const jsAnalyzer = new HalsteadComplexityAnalyzer(jsCode, 'javascript');
  
//   console.log('Python Halstead Complexity:', pythonAnalyzer.analyze());
//   console.log('JavaScript Halstead Complexity:', jsAnalyzer.analyze());