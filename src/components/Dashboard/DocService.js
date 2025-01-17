import { savePDF } from '@progress/kendo-react-pdf';

class DocService {
  createPdf = (html) => {
    savePDF(html, { 
      paperSize: 'A4',
      landscape: false,
      fileName: 'ticket.pdf',
      margin: 2,
      scale:0.75
    })
  }
}

const Doc = new DocService();
export default Doc;