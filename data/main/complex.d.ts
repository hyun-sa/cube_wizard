export declare class HalsteadComplexityAnalyzer {
    private static pythonOperators;
    private static jsOperators;
    private code;
    private language;
    constructor(code: string, language: 'python' | 'javascript');
    analyze(): {
        metrics: HalsteadMetrics;
        complexity: ComplexityMetrics;
    };
    private calculateHalsteadMetrics;
    private calculateComplexity;
    private tokenize;
    private tokenizePython;
    private tokenizeJavaScript;
    private isOperator;
}
interface HalsteadMetrics {
    n1: number;
    n2: number;
    N1: number;
    N2: number;
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
export {};
//# sourceMappingURL=complex.d.ts.map