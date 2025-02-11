import ko from 'ko';
import { Scope } from 'Common/Enums';

let keyScopeFake = Scope.All;

export const
	ScopeMenu = 'Menu',

	doc = document,

	$htmlCL = doc.documentElement.classList,

	elementById = id => doc.getElementById(id),

	exitFullscreen = () => getFullscreenElement() && (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc),
	getFullscreenElement = () => doc.fullscreenElement || doc.webkitFullscreenElement,

	Settings = rl.settings,
	SettingsGet = Settings.get,
	SettingsCapa = Settings.capa,

	dropdownVisibility = ko.observable(false).extend({ rateLimit: 0 }),

	moveAction = ko.observable(false),
	leftPanelDisabled = ko.observable(false),

	createElement = (name, attr) => {
		let el = doc.createElement(name);
		attr && Object.entries(attr).forEach(([k,v]) => el.setAttribute(k,v));
		return el;
	},

	fireEvent = (name, detail) => dispatchEvent(new CustomEvent(name, {detail:detail})),

	formFieldFocused = () => doc.activeElement && doc.activeElement.matches('input,textarea'),

	registerShortcut = (keys, modifiers, scopes, method) =>
		shortcuts.add(keys, modifiers, scopes, () => formFieldFocused() ? true : method()),

	addEventsListener = (element, events, fn, options) =>
		events.forEach(event => element.addEventListener(event, fn, options)),

	addEventsListeners = (element, events) =>
		Object.entries(events).forEach(([event, fn]) => element.addEventListener(event, fn)),

	// keys
	keyScopeReal = ko.observable(Scope.All),
	keyScope = value => {
		if (value) {
			if (ScopeMenu !== value) {
				keyScopeFake = value;
				if (dropdownVisibility()) {
					value = ScopeMenu;
				}
			}
			keyScopeReal(value);
			shortcuts.setScope(value);
		} else {
			return keyScopeFake;
		}
	};

dropdownVisibility.subscribe(value => {
	if (value) {
		keyScope(ScopeMenu);
	} else if (ScopeMenu === shortcuts.getScope()) {
		keyScope(keyScopeFake);
	}
});

leftPanelDisabled.toggle = () => leftPanelDisabled(!leftPanelDisabled());
leftPanelDisabled.subscribe(value => {
	value && moveAction() && moveAction(false);
	$htmlCL.toggle('rl-left-panel-disabled', value);
});

moveAction.subscribe(value => value && leftPanelDisabled() && leftPanelDisabled(false));
