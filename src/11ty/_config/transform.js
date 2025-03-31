import prettier from 'prettier';

export default function(eleventyConfig) {
    // Prettify HTML output, ignore CSS
    eleventyConfig.addTransform("prettier", function(content) {
        if ((this.page.outputPath || "").endsWith(".html")) {
            let prettified = prettier.format(content, {
                bracketSameLine: true,
                printWidth: 512,
                parser: "html",
                tabWidth: 2, 
                embeddedLanguageFormatting: "off"
            });
            return prettified;
        }
        // If not an HTML output, return content as-is
        return content;
    });
}