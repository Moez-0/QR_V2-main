using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Newtonsoft.Json.Linq;
using System.Threading;

using System;

namespace PDF1
{
    public class Generate65PDF1
    {
        private static readonly object fileLock = new object();

        private readonly double paperWidthInMillimeters;
        private readonly double paperHeightInMillimeters;
        private readonly int nbRows;
        private readonly int nbColumns;
        private readonly int bottomMargin;
        private readonly int topMargin;
        //,tSize,tBold,tAlig
        private readonly int titleSize;
        private readonly bool titleBold;
        private readonly string titleAlign;
        private readonly string barcodeType;

        [Obsolete]
        public Generate65PDF1(double paperWidthInMillimeters, double paperHeightInMillimeters,int nbRows,int nbColumns,int bottomMargin,int topMargin,int titleSize,bool titleBold,string titleAlign,string barcodeType, JArray dataArray)
        {
            this.paperWidthInMillimeters = paperWidthInMillimeters;
            this.paperHeightInMillimeters = paperHeightInMillimeters;
            this.nbRows = nbRows;
            this.nbColumns = nbColumns;
            this.bottomMargin = bottomMargin;
            this.topMargin = topMargin;
            this.titleSize = titleSize;
            this.titleBold = titleBold;
            this.titleAlign = titleAlign;
             this.barcodeType = barcodeType;

            
            QuestPDF.Settings.License = LicenseType.Community;
            FontManager.RegisterFont(File.OpenRead("./font/LibreBarcode39-Regular.ttf")); // use file name
            FontManager.RegisterFont(File.OpenRead("./font/LibreBarcode128-Regular.ttf"));
            try{
RetryOnIOException(() =>
            {
            lock (fileLock)
            {
            Document.Create(container =>
            {
                container.Page(page =>
                {
                    
                    page.Margin(5);
                    page.MarginTop(topMargin);
                    page.MarginBottom(bottomMargin);
                    double paperWidthInPoints = paperWidthInMillimeters * 2.83465; // Convert mm to points
                    double paperHeightInPoints = paperHeightInMillimeters * 2.83465; // Convert mm to points
                    float pageWidthInPoints = (float)(paperWidthInPoints);
                    float pageHeightInPoints = (float)(paperHeightInPoints);
                    page.Size(new PageSize(pageWidthInPoints, pageHeightInPoints)); // Width and height in points

                    page.Content()
                    
                       
                        .Grid(grid =>
                        {

                            grid.VerticalSpacing(10);
                            grid.HorizontalSpacing(4);
                            grid.AlignCenter();
                            grid.Columns(nbColumns); // 12 by default

for (int i = 0; i < dataArray.Count; i++)
{
      var item = dataArray[i];
    string title = item["Title"].ToString();
    string description = item["Description"].ToString();
    string code = item["Code"].ToString();

    // Calculate width and height of each grid item
    double itemWidth = (paperWidthInPoints / nbColumns) - 2; // Divide page width by number of columns and subtract spacing
     double itemHeight = (paperHeightInPoints / nbRows) - 2;

    // Calculate maximum available width and height for text
    double maxWidth = itemWidth - 4; // Subtracting padding
    double maxHeight = itemHeight - 4; // Subtracting padding

    // Calculate font sizes based on available space
    double titleFontSize = Math.Min(maxWidth / 10, maxHeight / 5); // Adjust according to your preference
    double descriptionFontSize = Math.Min(maxWidth / 15, maxHeight / 5); // Adjust according to your preference
    double barcodeFontSize = Math.Min(maxWidth / 8, maxHeight / 2); // Adjust according to your preference

    // Create a new grid item with the specified properties
    grid.Item(3).Background(Colors.White).Border(1).BorderColor(Colors.Black)
    //.Width((float)(itemWidth - 2)) // Subtracting margin from width
    .Height(90) // Height of the item
    .Padding(1) // Padding within the item (if needed)
    .AlignCenter() // Align the content to the center
    .Text(text =>
    {
        text.EmptyLine();
        if (titleBold){
        text.Line(title).Bold().FontSize(titleSize);
        }else{
             text.Line(title).FontSize(titleSize);
        }
        if (titleAlign == "center"){
        text.AlignCenter();
        }else{
            if (titleAlign == "right"){
                 text.AlignRight();
                
            }else{
               text.AlignLeft();
            }

        }
        text.EmptyLine();
        if(barcodeType == "128"){
        text.Line(code).FontFamily("Libre Barcode 128").FontSize(27).LineHeight(0.5f).LetterSpacing(-0.1f); // Cast to float   
        }else{
            text.Line(code).FontFamily("Libre Barcode 39").FontSize(27).LineHeight(0.5f).LetterSpacing(-0.1f); // Cast to floa
        }     
        text.Line(code).FontSize(8); // Cast to float
    }
    );
        
}


                        });
                });
            })
            .GeneratePdf("65pdf.pdf");
            }
             });
        }

        catch (IOException ex)
        {
            // Handle PDF generation failure
            Console.WriteLine($"Failed to generate PDF: {ex.Message}");
            // You may want to throw the exception or take alternative action here
            throw;
        }
    }
        private void RetryOnIOException(Action action)
        {
            const int maxRetries = 100;
            const int delayMs = 2000;

            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    action();
                    return;
                }
                catch (IOException)
                {
                    // Failed due to IOException, wait for a short delay and retry
                    Thread.Sleep(delayMs);
                }
            }

            // If retries fail, rethrow the exception
            throw new IOException("Failed to perform file operation after multiple retries.");
        }
    }
}
