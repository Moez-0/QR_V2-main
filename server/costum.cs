using Microsoft.AspNetCore.Mvc.RazorPages;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Previewer;
using System;
using System.Reflection.Emit;


using System.Collections.Generic;



//make array example with 65 items
//make a loop to generate 65 items


namespace PDF3
{

    public class GenerateC
    {



        [Obsolete]
        public GenerateC()
        {

            QuestPDF.Settings.License = LicenseType.Community;
FontManager.RegisterFont(File.OpenRead("./font/LibreBarcode39-Regular.ttf")); // use file name

           Document.Create(container =>
{

    container.Page(page =>

    {
         page.Size(PageSizes.A4);
        
       page.Content()
            
            .Border(1)
            .Grid(grid =>
{

    grid.VerticalSpacing(1);
    grid.HorizontalSpacing(1);
    grid.AlignCenter();

    grid.Columns(11); // 12 by default
     for( int i = 1;i <= 40 ;i++){
     grid.Item(2).Background(Colors.White).Border(1).BorderColor(Colors.Black).Height(60).Padding(1).Text(text =>
     {
         String title = "Title " + i;
         text.Span(title).Bold().FontSize(8);


         text.AlignCenter();
         text.EmptyLine();
         var random = new Random();
         var barcode = random.Next(100000000, 999999999).ToString();
        
         text.Span(barcode).FontFamily("Libre Barcode 39").FontSize(22);




         text.EmptyLine();
         text.Span(barcode).FontSize(6);

     });
   
    

     }


});



    });
})
.GeneratePdf("costum.pdf");


    }

}

}