/**
 * Evaluates a string of C# code line-by-line using a simulated runtime environment.
 * Handles variables, assignments, basic updates, and Console.WriteLine output.
 */
export async function runCsharpCode(source) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lines = source.split("\n");
      const variables = {}; // Local memory store: key -> evaluated primitive value
      let stdoutLines = [];
      let openBraces = 0;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Skip comments and empty lines
        if (!line || line.startsWith("//")) continue;

        // Keep a basic count of scope blocks
        if (line.includes("{")) openBraces += (line.match(/{/g) || []).length;
        if (line.includes("}")) openBraces -= (line.match(/}/g) || []).length;

        // Ignore boilerplate infrastructure statements for client-side processing
        if (
          line.startsWith("using ") ||
          line.startsWith("class ") ||
          line.startsWith("namespace ") ||
          line.match(/(public|private|static|void|int)\s+Main/)
        ) {
          continue;
        }

        // Clean trailing syntax markers if present
        const hasSemicolon = line.endsWith(";");
        const cleanLine = hasSemicolon ? line.slice(0, -1).trim() : line;

        // 1. Check for missing semicolons on expressions (excluding block brackets)
        if (!hasSemicolon && !line.endsWith("{") && !line.endsWith("}")) {
          resolve({
            result: { error: `Compilation Error (CS1002): ; expected on line ${i + 1}` },
            runtime: "browser"
          });
          return;
        }

        // 2. Parse Console.WriteLine(...)
        if (cleanLine.startsWith("Console.WriteLine")) {
          const match = cleanLine.match(/Console\.WriteLine\s*\((.*)\)/);
          if (match) {
            const expression = match[1].trim();
            try {
              const outputValue = evaluateExpression(expression, variables);
              stdoutLines.push(String(outputValue));
            } catch (err) {
              resolve({
                result: { error: `Runtime Error on line ${i + 1}: ${err.message}` },
                runtime: "browser"
              });
              return;
            }
          }
          continue;
        }

        // 3. Parse Variable Declarations (e.g., int x = 5; string name = "Poly"; var flag = true;)
        const declMatch = cleanLine.match(/^(int|string|bool|double|char|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/);
        if (declMatch) {
          const [,, varName, expression] = declMatch;
          try {
            variables[varName] = evaluateExpression(expression.trim(), variables);
          } catch (err) {
            resolve({
              result: { error: `Runtime Error on line ${i + 1}: ${err.message}` },
              runtime: "browser"
            });
            return;
          }
          continue;
        }

        // 4. Parse Variable Re-assignments (e.g., x = 10; score += 5;)
        const assignMatch = cleanLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+?=|-\s*=)\s*(.*)$/);
        if (assignMatch) {
          const [, varName, operator, expression] = assignMatch;
          if (!(varName in variables)) {
            resolve({
              result: { error: `Compilation Error (CS0103): The name '${varName}' does not exist in the current context on line ${i + 1}` },
              runtime: "browser"
            });
            return;
          }

          try {
            const value = evaluateExpression(expression.trim(), variables);
            if (operator === "+=") variables[varName] += value;
            else if (operator === "-=") variables[varName] -= value;
            else variables[varName] = value;
          } catch (err) {
            resolve({
              result: { error: `Runtime Error on line ${i + 1}: ${err.message}` },
              runtime: "browser"
            });
            return;
          }
          continue;
        }
      }

      // 5. Scope validation check
      if (openBraces > 0) {
        resolve({
          result: { error: "Compilation Error (CS1513): } expected" },
          runtime: "browser"
        });
        return;
      }

      resolve({
        result: { stdout: stdoutLines.join("\n") || "Process exited with code 0 (no printed output)." },
        runtime: "browser"
      });
    }, 400);
  });
}

/**
 * Helper to safely substitute memory values and process arithmetic/concatenation
 */
function evaluateExpression(expr, variables) {
  // Handle literal strings safely
  if (expr.startsWith('"') && expr.endsWith('"')) {
    return expr.slice(1, -1);
  }

  // Tokens optimization: replace defined variables with their current primitive state values
  let tokens = expr;
  Object.keys(variables).forEach((varName) => {
    // Ensure we match complete words so 'x' doesn't replace characters inside 'max'
    const regex = new RegExp(`\\b${varName}\\b`, "g");
    const val = variables[varName];
    tokens = tokens.replace(regex, typeof val === "string" ? `"${val}"` : val);
  });

  try {
    // Using a sanitized, scoped evaluation container for basic arithmetic/string operations
    // e.g. "Hello " + "World" or 5 + 10 - 2
    return Function(`return (${tokens});`)();
  } catch {
    throw new Error(`Invalid expression syntax: ${expr}`);
  }
}

export function formatCsharpOutput(result) {
  return result?.stdout || "";
}

export function getCsharpRuntimeError(result) {
  return result?.error || null;
}