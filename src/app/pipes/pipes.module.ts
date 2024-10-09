import { NgModule } from '@angular/core';
import { ImagePipe } from './image.pipe';
import { LinePipe } from './line.pipe';
import { NumberSignPipe } from './number-sign.pipe';
import { KeywordURLPipe } from './keyword-url.pipe';

@NgModule({
  declarations: [ImagePipe, LinePipe, NumberSignPipe, KeywordURLPipe],
  imports: [],
  exports: [
    ImagePipe,
    LinePipe,
    NumberSignPipe,
    KeywordURLPipe
  ]
})

export class PipesModule { }
