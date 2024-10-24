import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SpartieScanner {
    private String source;

    private int start = 0;
    private int current = 0;
    private int line = 1;

    private static final Map<String, TokenType> keywords = new HashMap<>();
    static {
        keywords.put("if", TokenType.IF);
        keywords.put("else", TokenType.ELSE);
        keywords.put("for", TokenType.FOR);
        keywords.put("while", TokenType.WHILE);
        keywords.put("true", TokenType.TRUE);
        keywords.put("false", TokenType.FALSE);
        keywords.put("fun", TokenType.FUN);
        keywords.put("return", TokenType.RETURN);
        keywords.put("var", TokenType.VAR);
        keywords.put("print", TokenType.PRINT);
        keywords.put("null", TokenType.NULL);
    }

    public SpartieScanner(String source) {
        this.source = source;
    }

    public List<Token> scan() {
        List<Token> tokens = new ArrayList<>();

        Token token = null;
        while (!isAtEnd() && (token = getNextToken()) != null) {
            if (token.type != TokenType.IGNORE)
                tokens.add(token);
        }
        
        return tokens;
    }

    private Token getNextToken() {
        Token token = null;

        // Try to get each type of token, starting with a simple token, and getting a
        // little more complex
        token = getSingleCharacterToken();
        if (token == null)
            token = getComparisonToken();
        if (token == null)
            token = getDivideOrComment();
        if (token == null)
            token = getStringToken();
        if (token == null)
            token = getNumericToken();
        if (token == null)
            token = getIdentifierOrReservedWord();
        if (token == null) {
            error(line, String.format("Unexpected character '%c' at %d", source.charAt(current), current));
        }

        return token;
    }

    // TODO: Complete implementation
    private Token getSingleCharacterToken() {
        // Hint: Examine the character, if you can get a token, return it, otherwise
        // return null
        // Hint: Be careful with the divide, we have not know if it is a single
        // character

        char nextCharacter = source.charAt(current);

        TokenType type = TokenType.UNDEFINED;

        System.out.println("isAtEnd(): " + isAtEnd());
        System.out.println("current: " + current);
        
        
        System.out.println("nextCharacter: " + nextCharacter);
        // Hint: Start of not knowing what the token is, if we can determine it, return
        // it, otherwise, return null
        
        if (nextCharacter == ' ') {
            type = TokenType.IGNORE;
        } else if (nextCharacter == '\n') {
            line++;
            type = TokenType.IGNORE;
            System.out.println("new line");
        // SIMPLE TOKENS
        } else if (nextCharacter == ';') {
            type = TokenType.SEMICOLON;
        } else if (nextCharacter == ',') {
            type = TokenType.COMMA;
        } else if (nextCharacter == '{') {
            type = TokenType.LEFT_BRACE;
        } else if (nextCharacter == '}') {
            type = TokenType.RIGHT_BRACE;
        } else if (nextCharacter == '(') {
            type = TokenType.LEFT_PAREN;
        } else if (nextCharacter == ')') {
            type = TokenType.RIGHT_PAREN;
        } else if (nextCharacter == '+') {
            type = TokenType.ADD;
        } else if (nextCharacter == '-') {
            type = TokenType.SUBTRACT; 
        } else if (nextCharacter == '*') {
            type = TokenType.MULTIPLY;
        } else {
            Token token = null;
            return token;           
        }
        
        current++;
        Token token = new Token(type, String.valueOf(nextCharacter), line);
        return token;
    }

    // TODO: Complete implementation
    private Token getComparisonToken() {

        // Hint: Examine the character for a comparison but check the next character (as
        // long as one is available)
        // For example: < or <=
        
        char nextCharacter = source.charAt(current);
        String text = String.valueOf(nextCharacter);
        TokenType type = TokenType.UNDEFINED;
        
        if (nextCharacter == '<') {
            if (current + 1 < source.length() && examine('=')) {
                text = "<=";
                type = TokenType.LESS_EQUAL;
                current++;
            } else {
                type = TokenType.LESS_THAN;
            }
        } else if (nextCharacter == '>') {
            if (current + 1 < source.length() && examine('=')) {
                text = ">=";
                type = TokenType.GREATER_EQUAL;
                current++;
            } else {
                type = TokenType.GREATER_THAN;
            }
        } else if (nextCharacter == '=') {
            if (current + 1 < source.length() && examine('=')) {
                type = TokenType.EQUIVALENT;
                text = "==";
                current++;
            } else {
                type = TokenType.ASSIGN;
            }
        } else if (nextCharacter == '!') {
            if (current + 1 < source.length() && examine('=')) {
                type = TokenType.NOT_EQUAL;
                text = "!=";
                current++;
            } else {
                type = TokenType.NOT;
            }
        } else {
            Token token = null;
            return token;   
        }
        
        Token token = new Token(type, text, line);
        current++;

        return token;
    }

    // TODO: Complete implementation
    private Token getDivideOrComment() {
        // Hint: Examine the character for a comparison but check the next character (as
        // long as one is available)
        char nextCharacter = source.charAt(current);
        TokenType type = TokenType.UNDEFINED;
        if (nextCharacter == '/') {
            if (current + 1 < source.length() && examine('/')) {
                while (current + 1 < source.length() && ! examine('\n')) {
                    current++;
                }
                type = TokenType.IGNORE;
            } else {
                type = TokenType.DIVIDE;
            }
        } else {
            Token token = null;
            return token;   
        }
        Token token = new Token(type, String.valueOf(nextCharacter), line);
        current++;

        return token;
    }

    // TODO: Complete implementation
    private Token getStringToken() {
        // Hint: Check if you have a double quote, then keep reading until you hit
        // another double quote
        // But, if you do not hit another double quote, you should report an error
        char nextCharacter = source.charAt(current);

        String string = null;

        return null;
    }

    // TODO: Complete implementation
    private Token getNumericToken() {
        // Hint: Follow similar idea of String, but in this case if it is a digit
        // You should only allow one period in your scanner
        return null;
    }

    // TODO: Complete implementation
    private Token getIdentifierOrReservedWord() {
        // Hint: Assume first it is an identifier and once you capture it, then check if
        // it is a reserved word.
        return null;
    }

    // Helper Methods
    private boolean isDigit(char character) {
        return character >= '0' && character <= '9';
    }

    private boolean isAlpha(char character) {
        return character >= 'a' && character <= 'z' ||
                character >= 'A' && character <= 'Z';
    }

    // This will check if a character is what you expect, if so, it will advance
    // Useful for checking <= or //
    private boolean examine(char expected) {
        if (isAtEnd())
            return false;
        if (source.charAt(current + 1) != expected)
            return false;

        // Otherwise, it matches it, so advance
        return true;
    }

    private boolean isAtEnd() {
        return current >= source.length();
    }

    // Error handling
    private void error(int line, String message) {
        System.err.printf("Error occurred on line %d : %s\n", line, message);
        System.exit(ErrorCode.INTERPRET_ERROR);
    }
}
