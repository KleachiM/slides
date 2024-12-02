//editor

export type SelectionType = {
    type: 'slide' | 'element',
    value: string[],
}

export type Presentation = {
    title: string,
    slides: Array<Slide>,
    activeSlideId: string,
    selection: SelectionType,
}

export type Slide = {
    id: string,
    background: string | Image,
    slideData: Array<SlideElement>,
}

export type Point = {
    x: number,
    y: number
}

export type Dimension = {
    width: number,
    height: number
}

export type Block = {
    id: string,
    point: Point,
    dimension: Dimension
}

export type Image = {
    type: 'image',
    source: string
}

export type ImageBlock = Block & {
    type: 'image',
    source: string
}

export type TextBlock = Block & {
    type: 'text',
    content: string,
    fontSize: number,
    fontColor: string,
    fontFamily: string
}

export type SlideElement = TextBlock|ImageBlock;

export type SelectionElement = {
    selected: Array<SlideElement>
}

