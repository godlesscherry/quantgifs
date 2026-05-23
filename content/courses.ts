import type { Course } from "@/lib/content";

export const courses: Course[] = [
  {
    slug: "msc-financial-engineering",
    title: "MSc Financial Engineering",
    description:
      "Core stochastic calculus, derivative pricing, and fixed-income concepts for quantitative finance.",
    modules: [
      {
        slug: "stochastic-calculus",
        title: "Stochastic Calculus & Derivatives",
        summary:
          "Random processes, Itô calculus, and the foundations of derivative pricing models.",
        lessons: [
          {
            slug: "intro-to-modeling",
            title: "Introduction to Financial Modeling",
            summary:
              "From random walks to option pricing and the term structure of interest rates.",
            concepts: [
              {
                slug: "brownian-motion",
                title: "Brownian Motion",
                summary:
                  "The continuous-time random process that underpins stochastic asset models.",
                formulas: [
                  "dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dW_t",
                  "W_t \\sim \\mathcal{N}(0, t)",
                ],
                body: [
                  {
                    heading: "Geometric Brownian Motion",
                    paragraphs: [
                      "Brownian motion provides the stochastic driver for many asset price models. In geometric Brownian motion (GBM), the logarithm of the asset price follows a random walk with drift.",
                      "The volatility parameter σ controls the magnitude of random fluctuations, while μ represents the expected drift of the asset.",
                    ],
                    callout: {
                      type: "note",
                      title: "Key insight",
                      content:
                        "GBM assumes constant volatility and continuous trading. Real markets exhibit jumps, stochastic volatility, and discrete time steps.",
                    },
                  },
                  {
                    heading: "Simulation",
                    paragraphs: [
                      "Monte Carlo simulation discretizes the SDE over small time steps. Each path is one possible future trajectory of the asset price.",
                      "The visualization below shows sample paths generated from a discrete approximation of the SDE.",
                    ],
                  },
                ],
                visualizationKey: "brownian-motion",
                tags: ["stochastic", "SDE", "simulation"],
              },
              {
                slug: "black-scholes-model",
                title: "Black-Scholes Model",
                summary:
                  "Closed-form European option pricing under geometric Brownian motion.",
                formulas: [
                  "C = S_0 N(d_1) - K e^{-rT} N(d_2)",
                  "d_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}",
                ],
                body: [
                  {
                    heading: "European Call Option",
                    paragraphs: [
                      "The Black-Scholes formula gives the fair value of a European call option under GBM with constant volatility and a risk-free rate r.",
                      "N(·) denotes the cumulative standard normal distribution. The formula separates the expected payoff into components weighted by risk-neutral probabilities.",
                    ],
                    callout: {
                      type: "info",
                      title: "Assumptions",
                      content:
                        "No arbitrage, constant r and σ, no dividends, and continuous trading. Violations of these assumptions motivate extensions like local volatility and jump-diffusion models.",
                    },
                  },
                  {
                    heading: "Payoff at Expiry",
                    paragraphs: [
                      "At expiry, a call option pays max(S − K, 0) and a put pays max(K − S, 0). The chart below shows these piecewise-linear payoff profiles as a function of the spot price.",
                    ],
                  },
                ],
                visualizationKey: "black-scholes",
                tags: ["options", "derivatives", "pricing"],
              },
              {
                slug: "yield-curve",
                title: "Yield Curve",
                summary:
                  "The relationship between bond maturity and yield, central to fixed-income valuation.",
                formulas: [
                  "P(0, T) = e^{-y(T) \\cdot T}",
                  "y(T) = -\\frac{1}{T} \\ln P(0, T)",
                ],
                body: [
                  {
                    heading: "Term Structure",
                    paragraphs: [
                      "The yield curve maps maturity T to the yield y(T) implied by zero-coupon bond prices. Its shape reflects market expectations of future rates, liquidity preferences, and risk premia.",
                      "Common shapes include upward-sloping (normal), inverted, and humped curves—each carrying different macroeconomic interpretations.",
                    ],
                    callout: {
                      type: "warning",
                      title: "Modeling note",
                      content:
                        "Parametric models like Nelson-Siegel and Svensson fit smooth curves to observed market data. This visualization uses illustrative sample yields.",
                    },
                  },
                  {
                    heading: "Reading the Curve",
                    paragraphs: [
                      "Short-end yields are sensitive to central bank policy; long-end yields reflect growth and inflation expectations. Steepening or flattening moves are key signals for relative-value strategies.",
                    ],
                  },
                ],
                visualizationKey: "yield-curve",
                tags: ["fixed-income", "rates", "bonds"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "econometrics",
    title: "Econometrics",
    description:
      "Statistical methods for economic data: transformation, estimation, and inference.",
    modules: [
      {
        slug: "data-transformation",
        title: "Data Transformation",
        summary:
          "Preparing and reshaping data for econometric modeling and regression.",
        lessons: [
          {
            slug: "linear-regression",
            title: "Linear Regression",
            summary:
              "Ordinary least squares, assumptions, and interpretation of linear models.",
            concepts: [
              {
                slug: "core-model-components",
                title: "The Core Model Components",
                summary:
                  "Predictors, responses, the linear function, coefficients, the least-squares line, and identifiability.",
                formulas: [
                  "(X_1, Y_1), \\ldots, (X_n, Y_n)",
                  "f(X) = \\beta_0 + \\beta_1 X + \\varepsilon",
                  "\\min_{\\beta_0, \\beta_1} \\sum_{i=1}^{n} (Y_i - \\beta_0 - \\beta_1 X_i)^2",
                ],
                body: [
                  {
                    heading: "Predictor (X) and Response (Y)",
                    paragraphs: [
                      "Each observation is a pair (Xᵢ, Yᵢ). The predictor X is plotted on the horizontal axis; the response Y on the vertical axis. Together they form a scatter of n points in the plane.",
                      "Use the **X & Y** step in the visualization to see labeled pairs (X₁, Y₁), …, (Xₙ, Yₙ).",
                    ],
                  },
                  {
                    heading: "Linear Regression Function",
                    paragraphs: [
                      "The model posits that Y is related to X through a linear function plus noise: f(X) = β₀ + β₁X + ε, where ε captures random deviation from the line.",
                      "The **f(X)** step overlays the structural line; randomness appears as vertical scatter of the observed points around it.",
                    ],
                  },
                  {
                    heading: "Intercept (β₀) and Slope (β₁)",
                    paragraphs: [
                      "β₀ is the value of f(X) when X = 0—the point where the line crosses the y-axis (when zero is in the range of interest). β₁ is the change in the fitted value per one-unit increase in X, i.e. the steepness of the line.",
                      "The **β₀ & β₁** step highlights the intercept on the y-axis and a unit run-rise segment for the slope.",
                    ],
                  },
                  {
                    heading: "Least-Squares Line",
                    paragraphs: [
                      "Among all lines, ordinary least squares chooses β̂₀ and β̂₁ to minimize the sum of squared vertical distances from each point to the line: Σᵢ (Yᵢ − β̂₀ − β̂₁Xᵢ)².",
                      "The **OLS line** step shows those vertical residuals and shaded squares suggesting squared error.",
                    ],
                    callout: {
                      type: "note",
                      title: "Key insight",
                      content:
                        "OLS uses vertical residuals (errors in Y), not perpendicular distances to the line. That choice matches predicting Y from X.",
                    },
                  },
                  {
                    heading: "Identifiability Constraint",
                    paragraphs: [
                      "To estimate a unique slope, the X values cannot all be identical. If every Xᵢ equals the same constant, all points lie on a vertical line and infinitely many lines pass through them—β₁ is not identified.",
                      "Toggle **Varied X** vs **All X equal** under **Identifiability** to compare a well-spread design with a degenerate one.",
                    ],
                    callout: {
                      type: "warning",
                      title: "Design requirement",
                      content:
                        "In matrix form, identifiability requires that X has full column rank (no perfect collinearity). Constant X is the simplest violation.",
                    },
                  },
                ],
                visualizationKey: "linear-regression-core",
                tags: ["regression", "OLS", "linear model"],
              },
              {
                slug: "error-and-fit-metrics",
                title: "Error and Fit Metrics",
                summary:
                  "Residuals, the R² statistic, and the MLE estimate of error variance for assessing model fit.",
                formulas: [
                  "r_i = Y_i - \\hat{Y}_i",
                  "R^2 = 1 - \\frac{\\sum_{i=1}^{n} r_i^2}{\\sum_{i=1}^{n} (Y_i - \\bar{Y})^2}",
                  "\\hat{\\sigma}^2 = \\frac{1}{n} \\sum_{i=1}^{n} r_i^2",
                ],
                body: [
                  {
                    heading: "Residuals (rᵢ)",
                    paragraphs: [
                      "For each observation, the residual rᵢ = Yᵢ − Ŷᵢ is the vertical distance between the observed response and the fitted value on the OLS line. Positive residuals lie above the line; negative residuals lie below.",
                      "Use the **Residuals** step to see labeled vertical gaps r₁, …, rₙ connecting each point to its prediction on the regression line.",
                    ],
                  },
                  {
                    heading: "R² Statistic",
                    paragraphs: [
                      "The coefficient of determination R² measures the proportion of total variability in Y explained by the linear model: R² = 1 − SSE/SST, where SSE = Σ rᵢ² and SST = Σ (Yᵢ − Ȳ)².",
                      "The **R²** step decomposes each observation into an explained segment (Ŷ − Ȳ, blue) and a residual segment (Y − Ŷ, pink). A higher R² indicates a tighter fit.",
                    ],
                    callout: {
                      type: "note",
                      title: "Interpretation",
                      content:
                        "R² = 1 means all points lie exactly on the fitted line; R² = 0 means the model explains no more variation than predicting the sample mean Ȳ.",
                    },
                  },
                  {
                    heading: "Error Variance (σ̂²)",
                    paragraphs: [
                      "Under the Gaussian noise assumption, the maximum-likelihood estimate of the error variance is σ̂² = (1/n) Σ rᵢ² — the average squared residual. It quantifies how far observations typically scatter around the fitted line.",
                      "The **σ̂²** step shows the computed MLE alongside residual spread. Larger σ̂² means greater unexplained noise in the response.",
                    ],
                    callout: {
                      type: "info",
                      title: "MLE vs unbiased",
                      content:
                        "The unbiased estimator divides by n − 2 in simple regression (n − k − 1 in general). The MLE uses n, which slightly underestimates σ² in small samples.",
                    },
                  },
                ],
                visualizationKey: "linear-regression-metrics",
                tags: ["regression", "R-squared", "residuals", "goodness of fit"],
              },
            ],
          },
        ],
      },
    ],
  },
];
