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
];
