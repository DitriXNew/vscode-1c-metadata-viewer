'use strict';

import * as vscode from 'vscode';
import { MetadataView } from './metadataView';
import * as fs from 'fs';
import { FormPreviewer } from './formPreviewer';
import { previewEdtForm } from './EdtFormPreview';
import { TreeItem } from './ConfigurationFormats/utils';

export function activate(context: vscode.ExtensionContext) {
	// Регистрация команды предпросмотра формы по пути (в начале, чтобы была доступна сразу)
	registerPreviewFormByPathCommand(context);

	// Проверяем переменную окружения для автоматического открытия формы
	const previewFormPath = process.env.PREVIEW_FORM_PATH;
	if (previewFormPath) {
		// Немного задержки чтобы расширение полностью активировалось
		setTimeout(() => {
			vscode.commands.executeCommand('metadataViewer.previewFormByPath', previewFormPath);
		}, 1000);
	}

	vscode.commands.registerCommand('metadataViewer.openAppModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/ManagedApplicationModule.bsl';
		} else {
			filePath = node.path + '/Configuration/ManagedApplicationModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openSessionModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/SessionModule.bsl';
		} else {
			filePath = node.path + '/Configuration/SessionModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openExternalConnectionModule', (node: TreeItem) => {
		// TODO: Имя модуля проверить. Может быть не верным.
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/ExternalConnectionModule.bsl';
		} else {
			filePath = node.path + '/Configuration/ExternalConnectionModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openObjectModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/ObjectModule.bsl';
		} else {
			filePath = node.path + '/ObjectModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openManagerModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/ManagerModule.bsl';
		} else {
			filePath = node.path + '/ManagerModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openForm', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/Form/Module.bsl';
		} else {
			filePath = node.path + '/Module.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.previewForm', (node: TreeItem) => {
		if (node.configType === 'xml') {
			const filePath = node.path + '/Ext/Form.xml';
			const objectPathArray = node.path?.split('/');
			const rootFilePath = objectPathArray?.slice(0, -2)?.join('/') + '.xml';
			const confPath = objectPathArray?.slice(0, -4)?.join('/');
			PreviewForm(confPath ?? '', rootFilePath, filePath, context.extensionUri, node.label);
		} else {
			// EDT формат - используем EdtFormPreviewer
			const formPath = node.path + '/Form.form';
			if (fs.existsSync(formPath)) {
				// Получаем путь к корню конфигурации EDT
				const pathParts = node.path?.split('/') || [];
				const srcIndex = pathParts.findIndex(p => p === 'src');
				const confPath = srcIndex > 0 ? pathParts.slice(0, srcIndex + 1).join('/') : node.path || '';
				const labelStr = typeof node.label === 'string' ? node.label : node.label?.label;
				previewEdtForm(confPath, formPath, context.extensionUri, labelStr);
			} else {
				vscode.window.showErrorMessage(`Файл формы не найден: ${formPath}`);
			}
		}
	});
	vscode.commands.registerCommand('metadataViewer.openModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/Module.bsl';
		} else {
			filePath = node.path + '/Module.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openCommandModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/CommandModule.bsl';
		} else {
			filePath = node.path + '/CommandModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openRecordSetModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/RecordSetModule.bsl';
		} else {
			// TODO: Не уверен в пути и посмотреть негде
			filePath = node.path + '/RecordSetModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openValueManagerModule', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			filePath = node.path + '/Ext/ValueManagerModule.bsl';
		} else {
			// TODO: Не уверен в пути и посмотреть негде
			filePath = node.path + '/ValueManagerModule.bsl';
		}
		OpenFile(filePath);
	});
	vscode.commands.registerCommand('metadataViewer.openXml', (node: TreeItem) => {
		let filePath = '';
		if (node.configType === 'xml') {
			if (node.isConfiguration) {
				filePath = node.path + '/Configuration.xml';
			} else {
				filePath = node.path + '.xml';
			}
		} else {
			// edt
			if (node.isConfiguration) {
				filePath = node.path + '/Configuration/Configuration.mdo';
			} else {
				if (node.path?.indexOf('/Forms/') === -1) {
					const objectPathArray = node.path?.split('/') ?? [];
					filePath = node.path + '/' + objectPathArray[objectPathArray.length - 1] + '.mdo';
				} else {
					filePath = node.path + '/Form.form';
				}
			}
		}
		OpenFile(filePath);
	});

	new MetadataView(context);
}

function OpenFile(filePath: string) {
	const openPath = vscode.Uri.file(filePath);
	if (fs.existsSync(filePath)) {
		vscode.workspace.openTextDocument(openPath).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	} else {
		vscode.window
			.showInformationMessage(`File ${filePath} does not exist. Create?`, 'Yes', 'No')
			.then(answer => {
				if (answer === 'Yes') {
					// TODO: Кроме собственно создания файла наверное надо что-то писать в XML? Наверняка нужно...
					vscode.workspace.fs.writeFile(openPath, new Uint8Array).then(_ => {
						vscode.window.showInformationMessage(`File ${filePath} is creted!`);
						vscode.workspace.openTextDocument(openPath).then(doc => {
							vscode.window.showTextDocument(doc);
						});
					});
				}
			});	
	}
}

function PreviewForm(confPath: string,
	rootFilePath: string,
	filePath: string,
	extensionUri: vscode.Uri,
	nodeDescription?: string | vscode.TreeItemLabel
) {
	const previewer = new FormPreviewer(confPath, rootFilePath, filePath);
	previewer.openPreview(extensionUri, nodeDescription);
}

/**
 * Предпросмотр формы EDT по пути к файлу
 * Можно вызвать из командной строки: 
 *   code --extensionDevelopmentPath=. --file-uri "command:metadataViewer.previewFormByPath?%5B%22путь%22%5D"
 * Или программно: vscode.commands.executeCommand('metadataViewer.previewFormByPath', 'C:/path/to/Form.form')
 */
function registerPreviewFormByPathCommand(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('metadataViewer.previewFormByPath', (formPath?: string) => {
		// Если путь не передан, запрашиваем через диалог
		if (!formPath) {
			vscode.window.showOpenDialog({
				canSelectFiles: true,
				canSelectFolders: false,
				canSelectMany: false,
				filters: {
					'1C Form': ['form', 'xml'],
					'All files': ['*']
				},
				title: 'Выберите файл формы 1С'
			}).then(uris => {
				if (uris && uris.length > 0) {
					openFormPreview(uris[0].fsPath, context.extensionUri);
				}
			});
			return;
		}

		openFormPreview(formPath, context.extensionUri);
	});
}

/**
 * Открывает предпросмотр формы
 */
function openFormPreview(formPath: string, extensionUri: vscode.Uri) {
	// Проверяем существование файла
	if (!fs.existsSync(formPath)) {
		vscode.window.showErrorMessage(`Файл не найден: ${formPath}`);
		return;
	}

	// Определяем тип формы по расширению и содержимому
	const ext = formPath.toLowerCase();
	
	if (ext.endsWith('.form') || ext.endsWith('form.form')) {
		// EDT формат
		const pathParts = formPath.split(/[\/\\]/);
		const srcIndex = pathParts.findIndex(p => p === 'src');
		const confPath = srcIndex > 0 ? pathParts.slice(0, srcIndex + 1).join('/') : '';
		
		// Получаем имя формы из пути
		const formName = pathParts[pathParts.length - 2] || 'Form';
		
		previewEdtForm(confPath, formPath, extensionUri, formName);
	} else if (ext.endsWith('.xml')) {
		// Может быть XML формат конфигуратора или EDT в XML
		const content = fs.readFileSync(formPath, 'utf-8');
		
		if (content.includes('<Form ') || content.includes('<Form>')) {
			// Это форма - проверяем namespace
			const pathParts = formPath.split(/[\/\\]/);
			const formName = pathParts[pathParts.length - 1].replace('.xml', '');
			
			if (content.includes('xmlns="http://v8.1c.ru/8.3/xcf/readable/form"')) {
				// EDT формат в XML (readable)
				const confPath = pathParts.slice(0, -2).join('/');
				previewEdtForm(confPath, formPath, extensionUri, formName);
			} else if (content.includes('http://v8.1c.ru/8.3/xcf/logform') || 
					   content.includes('http://v8.1c.ru/8.2/managed-application/logform')) {
				// XML формат конфигуратора - тоже поддерживаем через наш парсер!
				const confPath = pathParts.slice(0, -1).join('/');
				previewEdtForm(confPath, formPath, extensionUri, formName);
			} else {
				// Неизвестный формат - пробуем открыть
				const confPath = pathParts.slice(0, -1).join('/');
				previewEdtForm(confPath, formPath, extensionUri, formName);
			}
		} else {
			vscode.window.showErrorMessage('Файл не является формой 1С');
		}
	} else {
		vscode.window.showErrorMessage('Неподдерживаемый формат файла. Ожидается .form или .xml');
	}
}
