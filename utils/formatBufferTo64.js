import path from 'path';
import DatauriParser from 'datauri/parser.js';

const parser=new DatauriParser();

const formatBufferTo64=(file)=>{
 return parser.format(path.extname(file.originalname).toString(),file.buffer);
}

export default formatBufferTo64