import { locator } from '../../lib/pageObjects';

export default class App {
    SimpleTextElement = locator('#textValue');
    SimpleTextListItems = locator('#textValueList li');
    SimpleTextListItemByIndex = locator.template(idx => `#textValueList li:nth-child(${idx})`);
    SimpleTextListItemByText = locator.native(({ cy, argument }) => cy.get(`#textValueList li`).filter(`:contains("${argument}")`));
    SimpleTextInput = locator('#textInput');
    FileInput = locator('#fileInput');
    Action = locator('#action');
    AlertButton = locator('#confirm');
    PromptButton = locator('#prompt');
    Button = locator('#button');
    ButtonHover = locator('#buttonHover');
    Input = locator('#input');
    Select = locator('#select');
    Buttons = locator('.button');
    IFrame = locator('iframe#firstIframe');
    InnerIFrame = locator('iframe#innerIframe');
    FrameElement = locator('#frameElement');
    InnerFrameElement = locator('#innerFrameElement');
    NewTabLink = locator('#newTabLink');
    EnabledButton = locator('#enabledButton');
    DisabledButton = locator('#disabledButton');
    PresentElement = locator('#present');
    DetachElement = locator('#detach');
    VisibleElement = locator('#visible');
    HiddenElement = locator('#hidden');
    PresentCollection = locator('#present');

    Loading = locator('#loading');
    LoadingInput = locator('#loadingInput');
    WaitCollection = locator('#waitCollection > div');
    PressCounter = locator('#pressCounter');

    Users = locator('#users > li');
    OverflowContainer = locator('#overflowContainer');

    KeyDump = locator('#keywordevent');

    Cookie = locator('#cookie');
    LocalStorage = locator('#localStorage');
    SessionStorage = locator('#sessionStorage');

    DropZone = locator('div#div1');
    DragElement = locator('div#drag1');
    DragElementInDropZone = locator('div#div1 div#drag1');

    EventHandler = locator('#mouseEvent');
    KeyboardEventHandler = locator('#keyboardEvent');
    ScrollElement = locator('#scrollElement');
}