package com.pagepulse.util;

import com.pagepulse.dto.AuditResponse;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("HtmlParser Tests")
class HtmlParserTest {

    private HtmlParser htmlParser;

    @BeforeEach
    void setUp() {
        htmlParser = new HtmlParser();
    }

    @Nested
    @DisplayName("Title Extraction")
    class TitleExtraction {

        @Test
        @DisplayName("Should extract title from title tag")
        void shouldExtractTitleFromTitleTag() {
            String html = "<html><head><title>Test Page</title></head><body></body></html>";
            Document doc = Jsoup.parse(html);
            
            String title = htmlParser.extractTitle(doc);
            
            assertEquals("Test Page", title);
        }

        @Test
        @DisplayName("Should fall back to og:title when title tag is empty")
        void shouldFallbackToOgTitle() {
            String html = """
                <html>
                <head>
                    <title></title>
                    <meta property="og:title" content="OG Title">
                </head>
                <body></body>
                </html>
                """;
            Document doc = Jsoup.parse(html);
            
            String title = htmlParser.extractTitle(doc);
            
            assertEquals("OG Title", title);
        }

        @Test
        @DisplayName("Should return default when no title found")
        void shouldReturnDefaultWhenNoTitle() {
            String html = "<html><head></head><body></body></html>";
            Document doc = Jsoup.parse(html);
            
            String title = htmlParser.extractTitle(doc);
            
            assertEquals("No title found", title);
        }

        @Test
        @DisplayName("Should trim title whitespace")
        void shouldTrimTitleWhitespace() {
            String html = "<html><head><title>  Spaced Title  </title></head><body></body></html>";
            Document doc = Jsoup.parse(html);
            
            String title = htmlParser.extractTitle(doc);
            
            assertEquals("Spaced Title", title);
        }
    }

    @Nested
    @DisplayName("Meta Description Extraction")
    class MetaDescriptionExtraction {

        @Test
        @DisplayName("Should extract meta description")
        void shouldExtractMetaDescription() {
            String html = """
                <html>
                <head>
                    <meta name="description" content="Test description">
                </head>
                <body></body>
                </html>
                """;
            Document doc = Jsoup.parse(html);
            
            String description = htmlParser.extractMetaDescription(doc);
            
            assertEquals("Test description", description);
        }

        @Test
        @DisplayName("Should fall back to og:description")
        void shouldFallbackToOgDescription() {
            String html = """
                <html>
                <head>
                    <meta property="og:description" content="OG Description">
                </head>
                <body></body>
                </html>
                """;
            Document doc = Jsoup.parse(html);
            
            String description = htmlParser.extractMetaDescription(doc);
            
            assertEquals("OG Description", description);
        }

        @Test
        @DisplayName("Should fall back to twitter:description")
        void shouldFallbackToTwitterDescription() {
            String html = """
                <html>
                <head>
                    <meta name="twitter:description" content="Twitter Description">
                </head>
                <body></body>
                </html>
                """;
            Document doc = Jsoup.parse(html);
            
            String description = htmlParser.extractMetaDescription(doc);
            
            assertEquals("Twitter Description", description);
        }

        @Test
        @DisplayName("Should return default when no description found")
        void shouldReturnDefaultWhenNoDescription() {
            String html = "<html><head></head><body></body></html>";
            Document doc = Jsoup.parse(html);
            
            String description = htmlParser.extractMetaDescription(doc);
            
            assertEquals("No meta description found", description);
        }
    }

    @Nested
    @DisplayName("H1 Count")
    class H1Count {

        @Test
        @DisplayName("Should count single H1 tag")
        void shouldCountSingleH1() {
            String html = "<html><body><h1>Heading</h1></body></html>";
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countH1Tags(doc);
            
            assertEquals(1, count);
        }

        @Test
        @DisplayName("Should count multiple H1 tags")
        void shouldCountMultipleH1() {
            String html = "<html><body><h1>First</h1><h1>Second</h1><h1>Third</h1></body></html>";
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countH1Tags(doc);
            
            assertEquals(3, count);
        }

        @Test
        @DisplayName("Should return zero when no H1 tags")
        void shouldReturnZeroWhenNoH1() {
            String html = "<html><body><h2>Only H2</h2></body></html>";
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countH1Tags(doc);
            
            assertEquals(0, count);
        }
    }

    @Nested
    @DisplayName("Missing ALT Images")
    class MissingAltImages {

        @Test
        @DisplayName("Should count images without alt attribute")
        void shouldCountImageWithoutAlt() {
            String html = """
                <html><body>
                    <img src="test.jpg">
                    <img src="test2.jpg" alt="">
                </body></html>
                """;
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countMissingAltImages(doc);
            
            assertEquals(2, count);
        }

        @Test
        @DisplayName("Should not count images with alt attribute")
        void shouldNotCountImageWithAlt() {
            String html = """
                <html><body>
                    <img src="test.jpg" alt="Test image">
                    <img src="test2.jpg" alt="Another image">
                </body></html>
                """;
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countMissingAltImages(doc);
            
            assertEquals(0, count);
        }

        @Test
        @DisplayName("Should return zero when no images")
        void shouldReturnZeroWhenNoImages() {
            String html = "<html><body><p>No images here</p></body></html>";
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countMissingAltImages(doc);
            
            assertEquals(0, count);
        }
    }

    @Nested
    @DisplayName("Word Count")
    class WordCount {

        @Test
        @DisplayName("Should count words in body text")
        void shouldCountWordsInBody() {
            String html = "<html><body><p>Hello world this is a test</p></body></html>";
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countWords(doc);
            
            assertEquals(6, count);
        }

        @Test
        @DisplayName("Should ignore script content")
        void shouldIgnoreScriptContent() {
            String html = """
                <html><body>
                    <p>Visible text</p>
                    <script>function test() { return "invisible code"; }</script>
                </body></html>
                """;
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countWords(doc);
            
            assertEquals(2, count);
        }

        @Test
        @DisplayName("Should ignore style content")
        void shouldIgnoreStyleContent() {
            String html = """
                <html><body>
                    <p>Visible text</p>
                    <style>.hidden { display: none; color: red; }</style>
                </body></html>
                """;
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countWords(doc);
            
            assertEquals(2, count);
        }

        @Test
        @DisplayName("Should ignore hidden elements")
        void shouldIgnoreHiddenElements() {
            String html = """
                <html><body>
                    <p>Visible text</p>
                    <div style="display:none">Hidden text</div>
                    <span hidden>Also hidden</span>
                </body></html>
                """;
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countWords(doc);
            
            assertEquals(2, count);
        }

        @Test
        @DisplayName("Should return zero for empty body")
        void shouldReturnZeroForEmptyBody() {
            String html = "<html><body></body></html>";
            Document doc = Jsoup.parse(html);
            
            int count = htmlParser.countWords(doc);
            
            assertEquals(0, count);
        }
    }

    @Nested
    @DisplayName("Full Analysis")
    class FullAnalysis {

        @Test
        @DisplayName("Happy Path: Should analyze complete valid HTML document")
        void shouldAnalyzeCompleteDocument() {
            String html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Test Page Title</title>
                    <meta name="description" content="This is a test description">
                </head>
                <body>
                    <h1>Main Heading</h1>
                    <p>This is paragraph one with some text.</p>
                    <img src="test.jpg">
                    <img src="test2.jpg" alt="With alt">
                    <p>Another paragraph here.</p>
                </body>
                </html>
                """;
            Document doc = Jsoup.parse(html);
            
            AuditResponse response = htmlParser.analyze(doc, 200, 150);
            
            assertEquals(200, response.getStatus());
            assertEquals(150, response.getResponseTime());
            assertEquals("Test Page Title", response.getTitle());
            assertEquals("This is a test description", response.getMetaDescription());
            assertEquals(1, response.getH1Count());
            assertEquals(1, response.getMissingAltImages());
            assertTrue(response.getWordCount() > 0);
        }

        @Test
        @DisplayName("Failure Case 1: Should handle empty/blank HTML document gracefully")
        void shouldHandleEmptyDocumentGracefully() {
            String html = "";
            Document doc = Jsoup.parse(html);
            
            AuditResponse response = htmlParser.analyze(doc, 200, 50);
            
            assertEquals(200, response.getStatus());
            assertEquals(50, response.getResponseTime());
            assertEquals("No title found", response.getTitle());
            assertEquals("No meta description found", response.getMetaDescription());
            assertEquals(0, response.getH1Count());
            assertEquals(0, response.getMissingAltImages());
            assertEquals(0, response.getWordCount());
        }

        @Test
        @DisplayName("Failure Case 2: Should handle malformed HTML with unclosed tags and script-only content")
        void shouldHandleMalformedHtmlGracefully() {
            String html = "<div><h1>Unclosed Heading<p>Some body text with <img src='bad.png'> without alt <script>const secret = 'hidden code';</script>";
            Document doc = Jsoup.parse(html);
            
            AuditResponse response = htmlParser.analyze(doc, 500, 300);
            
            assertEquals(500, response.getStatus());
            assertEquals(300, response.getResponseTime());
            assertEquals("No title found", response.getTitle());
            assertEquals("No meta description found", response.getMetaDescription());
            assertEquals(1, response.getH1Count());
            assertEquals(1, response.getMissingAltImages());
            // Script tag text should be excluded from word count
            assertFalse(response.getWordCount() == 0);
        }
    }
}
