/**
 * ButtonXmlPartReader - парсер кнопки формы
 * @see com._1c.g5.v8.dt.form.import_.xml.reader.part.FormChildItemsXmlPartReader#readButton
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { Button } from '../../model/Button';
import { ExtendedTooltipXmlPartReader } from '../extendedtooltip/ExtendedTooltipXmlPartReader';

/**
 * Ридер для парсинга Button
 */
export class ButtonXmlPartReader extends AbstractFormXmlPartReader {

    private readonly extendedTooltipReader: ExtendedTooltipXmlPartReader;

    constructor() {
        super();
        this.extendedTooltipReader = new ExtendedTooltipXmlPartReader();
    }

    /**
     * Читает Button
     */
    read(node: XmlNode, context: XmlReaderContext, _errorCollector: XmlReadErrorCollector): Button {
        const button: Button = {
            id: this.readId(node) ?? 0,
            name: node.get('name').text() ?? ''
        };

        // DisplayImportance
        button.displayImportance = this.readDisplayImportance(node);

        // Type
        button.type = this.readEnum(node.get('Type'));

        // DataPath
        button.dataPath = this.readDataPath(node.get('DataPath'));

        // CommandName
        const commandNameText = node.get('CommandName').text();
        if (commandNameText && commandNameText !== '0') {
            button.commandName = commandNameText;
        }

        // Parameter
        const paramNode = node.get('Parameter');
        if (paramNode.exists()) {
            button.parameter = paramNode.text();
        }

        // Visible
        button.visible = this.readBoolean(node.get('Visible'));
        button.userVisible = this.readUserVisible(node.get('UserVisible'));
        button.enabled = this.readBoolean(node.get('Enabled'));

        // Representation
        button.representation = this.readEnum(node.get('Representation'));

        // DefaultButton
        button.defaultButton = this.readBoolean(node.get('DefaultButton'));

        // SkipOnInput
        button.skipOnInput = this.readBoolean(node.get('SkipOnInput'));

        // DefaultItem
        button.defaultItem = this.readBoolean(node.get('DefaultItem'));

        // OnlyInAllActions (pre-8.3.15, inverted)
        if (!this.versionIsAtLeast(context, '8.3.15')) {
            const onlyInAllActions = this.readBoolean(node.get('OnlyInAllActions'));
            if (onlyInAllActions !== undefined) {
                button.onlyInAllActions = !onlyInAllActions;
            }
        }

        // Sizes
        button.width = this.readNumber(node.get('Width'));
        button.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        button.maxWidth = this.readNumber(node.get('MaxWidth'));
        button.minWidth = this.readNumber(node.get('MinWidth'));
        button.height = this.readNumber(node.get('Height'));
        button.autoMaxHeight = this.readBoolean(node.get('AutoMaxHeight'));
        button.maxHeight = this.readNumber(node.get('MaxHeight'));

        // Stretch
        button.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));
        button.verticalStretch = this.readBoolean(node.get('VerticalStretch'));

        // Group align
        button.groupHorizontalAlign = this.readEnum(node.get('GroupHorizontalAlign'));
        button.groupVerticalAlign = this.readEnum(node.get('GroupVerticalAlign'));

        // PlacementArea
        button.placementArea = this.readEnum(node.get('PlacementArea'));

        // Check
        button.check = this.readBoolean(node.get('Check'));

        // Colors and fonts
        button.textColor = this.readColor(node.get('TextColor'));
        button.backColor = this.readColor(node.get('BackColor'));
        button.borderColor = this.readColor(node.get('BorderColor'));
        button.font = this.readFont(node.get('Font'));

        // Shortcut
        button.shortcut = node.get('Shortcut').text();

        // Picture
        button.picture = this.readPicture(node.get('Picture'));

        // Title
        button.title = this.readLocalizedString(node.get('Title'));
        button.titleHeight = this.readNumber(node.get('TitleHeight'));
        button.titleLocation = this.readEnum(node.get('TitleLocation'));
        button.titleBackColor = this.readColor(node.get('TitleBackColor'));

        // ToolTipRepresentation
        button.toolTipRepresentation = node.get('ToolTipRepresentation').text();

        // RepresentationInContextMenu
        button.representationInContextMenu = this.readEnum(node.get('RepresentationInContextMenu'));

        // Shape
        button.shape = this.readEnum(node.get('Shape'));
        button.shapeRepresentation = this.readEnum(node.get('ShapeRepresentation'));

        // PictureLocation
        button.pictureLocation = this.readEnum(node.get('PictureLocation'));

        // 8.3.15+
        if (this.versionIsAtLeast(context, '8.3.15')) {
            button.locationInCommandBar = this.readEnum(node.get('LocationInCommandBar'));
            button.commandUniqueness = this.readBoolean(node.get('CommandUniqueness'));
        }

        // 8.3.16+
        if (this.versionIsAtLeast(context, '8.3.16')) {
            button.onMainServerUnavalableBehavior = node.get('OnMainServerUnavalableBehavior').text();
        }

        // 8.5.1+
        if (this.versionIsAtLeast(context, '8.5.1')) {
            button.showAsCard = this.readBoolean(node.get('ShowAsCard'));
            button.backPicture = this.readPicture(node.get('BackPicture'));
            button.backPictureEffect = node.get('BackPictureEffect').text();
            button.cardPictureAndTitleAlign = node.get('CardPictureAndTitleAlign').text();
            button.pictureHeight = this.readNumber(node.get('PictureHeight'));
            button.buttonImportance = this.readEnum(node.get('ButtonImportance'));
        }

        // Расширенная подсказка
        button.extendedTooltip = this.extendedTooltipReader.readFromParent(node, context, _errorCollector);

        return button;
    }
}
