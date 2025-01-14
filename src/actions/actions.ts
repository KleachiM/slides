import {
    Presentation,
    Slide,
    Block,
    TextBlock,
    ImageBlock,
    Point,
    Dimension,
    Image,
    SelectionType
} from '../types/presentationTypes';

function getRandomString(): string {
    return `${new Date().getTime()}${Math.random()}`;
}

export const defaultBlock: Block = {
    id: getRandomString(),
    point: {x: 10, y: 10},
    dimension: {width: 50, height: 50}
}

const defaultTextBlock: TextBlock = {
    type: 'text',
    id: defaultBlock.id,
    point: {x: defaultBlock.point.x, y: defaultBlock.point.y},
    dimension: {
        width: defaultBlock.dimension.width,
        height: defaultBlock.dimension.height
    },
    content: '',
    fontSize: 10,
    fontColor: 'black',
    fontFamily: 'serif'
}

function getDefaultTextBlock(): TextBlock{
    return {
        type: 'text',
        id: getRandomString(),
        point: {x: defaultBlock.point.x, y: defaultBlock.point.y},
        dimension: {
            width: defaultBlock.dimension.width,
            height: defaultBlock.dimension.height
        },
        content: '',
        fontSize: 10,
        fontColor: 'black',
        fontFamily: 'serif'
    }
}

// const defaultImageBlock: ImageBlock = {
//     type: 'image',
//     id: defaultBlock.id,
//     point: {x: defaultBlock.point.x, y: defaultBlock.point.y},
//     dimension: {
//         width: defaultBlock.dimension.width,
//         height: defaultBlock.dimension.height
//     },
//     source: ''
// }

function getDefaultImageBlock(src: string): ImageBlock{
    return {
        type: 'image',
        id: getRandomString(),
        point: {x: defaultBlock.point.x, y: defaultBlock.point.y},
        dimension: {
            width: defaultBlock.dimension.width,
            height: defaultBlock.dimension.height
        },
        source: src
    }
}

// const defaultSlide: Slide = {
//     id: getRandomString(),
//     background: 'white',
//     slideData: []
// }

function getDefaultSlide(): Slide {
    return {
        id: getRandomString(),
        background: 'white',
        slideData: [],
    }
}

export function setTitle(pres: Presentation, newTitle: string): Presentation{
    if (newTitle === "")
        return pres;
    return {
        ...pres,
        title: newTitle
    }
}

export function setActiveSlide(pres: Presentation, activeSlideId: string): Presentation{
    return {
        ...pres,
        activeSlideId: activeSlideId,
        selection: {type: 'slide', value: [activeSlideId]}
    }
}

export function addSlide(presentation: Presentation): Presentation{
    const newSlides = [...presentation.slides];

    const index = newSlides.findIndex(slide => slide.id === presentation.activeSlideId)

    newSlides.splice(index + 1, 0, getDefaultSlide());

    return {
        ...presentation,
        slides: newSlides,
        activeSlideId: newSlides[index + 1].id
    }
}

export function deleteSlides(presentation: Presentation): Presentation{
    const newSlides = presentation.slides.filter(
        (slide) => !presentation.selection.value.includes(slide.id));

    const newActiveSlideIndex = newSlides.length > 0
        ? newSlides[newSlides.length - 1].id
        : '';

    return {
        ...presentation,
        slides: newSlides,
        activeSlideId: newActiveSlideIndex
    }
}

export function changeSlidePosition(presentation: Presentation, newPos: number): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(slide => slide.id === presentation.activeSlideId);

    if (newPos === activeSlideIndex)
        return presentation;

    const slides = [...presentation.slides];
    const slideToChange = slides[activeSlideIndex];

    slides.splice(activeSlideIndex, 1);
    slides.splice(newPos, 0, slideToChange);

    return {
        ...presentation,
        slides: slides
    }
}

export function addTextBlock(presentation: Presentation): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(s =>
        s.id === presentation.activeSlideId);

    const slideData = [...presentation.slides[activeSlideIndex].slideData];

    const defaultTextBlock = getDefaultTextBlock();
    slideData.push(defaultTextBlock);

    const newSlide = {
        ...presentation.slides[activeSlideIndex],
        slideData: slideData,
    }

    const slides = [...presentation.slides];
    slides[activeSlideIndex] = newSlide;

    return {
        ...presentation,
        slides: slides,
        selection: {type: 'element', value: [defaultTextBlock.id]}
    }
}

export function addImageBlock(presentation: Presentation, src: string): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(s =>
        s.id === presentation.activeSlideId);

    const slideData = [...presentation.slides[activeSlideIndex].slideData];

    const defaultImageBlock = getDefaultImageBlock(src);
    slideData.push(defaultImageBlock);

    const newSlide = {
        ...presentation.slides[activeSlideIndex],
        slideData: slideData,
    }

    const slides = [...presentation.slides];
    slides[activeSlideIndex] = newSlide;

    return {
        ...presentation,
        slides: slides,
        selection: {type: 'element', value: [defaultImageBlock.id]}
    }
}

export function deleteElement(presentation: Presentation) {
    const activeSlideIndex = presentation.slides.findIndex(
        s => s.id === presentation.activeSlideId
    );

    const newSlide = {
        ...presentation.slides[activeSlideIndex],
        slideData: presentation.slides[activeSlideIndex].slideData.filter(
            e => !presentation.selection.value.includes(e.id)
        )
    }

    const newSlides = [...presentation.slides];
    newSlides.splice(activeSlideIndex, 1, newSlide)

    return {
        ...presentation,
        slides: newSlides,
    }
}

export function moveElementByOffset(presentation: Presentation, offset: Point): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(s => s.id === presentation.activeSlideId);

    const newActiveSlideData = presentation.slides[activeSlideIndex].slideData.map(element => {
        if (!presentation.selection.value.includes(element.id)) {
            return element;
        }

        return {
            ...element,
            point: {
                x: element.point.x + offset.x,
                y: element.point.y + offset.y
            }
        }
    })

    const newSlides = [...presentation.slides];
    newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        slideData: newActiveSlideData,
    };

    return {
        ...presentation,
        slides: newSlides
    }
}

export function resizeElement(presentation: Presentation, offsetPoint: Point, offsetDimension: Dimension): Presentation{
    //todo: анализировать наложение элементов друг на друга
    const activeSlideIndex = presentation.slides.findIndex(s => s.id === presentation.activeSlideId);
    const newActiveSlideData = presentation.slides[activeSlideIndex].slideData.map(element => {
        if (!presentation.selection.value.includes(element.id)) {
            return element;
        }

        return {
            ...element,
            point: {
                x: element.point.x + offsetPoint.x,
                y: element.point.y + offsetPoint.y
            },
            dimension: {
                width: element.dimension.width + offsetDimension.width,
                height: element.dimension.height + offsetDimension.height
            }
        }
    })

    const newSlides = [...presentation.slides];
    newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        slideData: newActiveSlideData,
    };

    return {
        ...presentation,
        slides: newSlides
    }
}

export function changeTextBlockProperty(presentation: Presentation, propName: string, propValue: string|number): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(s => s.id === presentation.activeSlideId);

    if (typeof propValue === "number" && propValue === 0)
        propValue = 1;

    const newActiveSlideData = presentation.slides[activeSlideIndex].slideData.map(element => {
        if (presentation.selection.value.includes(element.id)){
            if (element.type !== 'text' || !(propName in element))
                return element;
            element[propName] = propValue;
        }
        return element;
    });

    const newSlides = [...presentation.slides];
    newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        slideData: newActiveSlideData,
    };

    return {
        ...presentation,
        slides: newSlides
    }
}

export function fontSizeIncOrDec(presentation: Presentation, needToInc: boolean): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(s => s.id === presentation.activeSlideId);

    const newActiveSlideData = presentation.slides[activeSlideIndex].slideData.map(element => {
        if (presentation.selection.value.includes(element.id)){
            if (element.type !== 'text')
                return element;

            if (needToInc)
                element.fontSize++;
            else
                element.fontSize--;
        }
        return element;
    });

    const newSlides = [...presentation.slides];
    newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        slideData: newActiveSlideData,
    };

    return {
        ...presentation,
        slides: newSlides
    }
}

export function changeItalic(presentation: Presentation): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(s => s.id === presentation.activeSlideId);

    const newActiveSlideData = presentation.slides[activeSlideIndex].slideData.map(element => {
        if (presentation.selection.value.includes(element.id)){
            if (element.type !== 'text')
                return element;

            // element.
        }
        return element;
    });

    const newSlides = [...presentation.slides];
    newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        slideData: newActiveSlideData,
    };

    return {
        ...presentation,
        slides: newSlides
    }
}
export function changeSlideBackground(presentation: Presentation, newBckgr: string|Image): Presentation{
    const activeSlideIndex = presentation.slides.findIndex(s => s.id === presentation.activeSlideId);

    const newSlides = [...presentation.slides];
    newSlides[activeSlideIndex] = {
        ...newSlides[activeSlideIndex],
        background: newBckgr
    }
    return {
        ...presentation,
        slides: newSlides
    }
}

export function setSelection(presentation: Presentation, newSelection: SelectionType){
    return {
        ...presentation,
        selection: newSelection
    }
}

export function getPresentationFromJson(presentation: Presentation, fileName: string): Presentation{

    return presentation;
}