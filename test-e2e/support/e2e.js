import defineQavajs from '../../defineQavajs';
import '../../index';

import App from '../page_object/';
import Memory from '../memory';

defineQavajs({
    pageObject: App,
    memory: new Memory()
});

