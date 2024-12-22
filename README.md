# CheckIt

een React Native (cross platform) app gemaakt voor het vak: Cross Platform Development,
Vives Hogeschool Kortrijk

Door Sam Vanden Berghe
- sam.vanden.berghe@icloud.com (privé)
- sam.vandenberghe@student.vives.be (school)

## App Functionaliteiten

- Projecten:
  - Project aanmaken
  - Alle projecten zien
  - Projecten filteren op naam
  - Taken van project zien
  - Project verwijderen
- Taken:
  - Taak toevoegen (project)
  - Alle taken zien
  - Taak aanpassen
  - Subtaak toevoegen (taak/subtaak)
  - Alle subtaken zien (taak/subtaak)
  - Subtaak aanpassen
  - Subtaak verwijderen
  - Taak verwijdren
- Categoriëen:
  - Categorie toevoegen
  - Alle categoriëen zien
  - Alle categoriëen oplijsten
  - Categorie verwijderen
- Prioriteit:
  - Standaard prioriteit kiezen
  - Alle prioriteiten oplijsten

## Goed om te weten

### Gebruik

Verwijderknoppen(vuilbakjes) moeten lang ingedrukt worden.
- dit om perongelijke verwijdering te voorkomen

Bij het opstarten voor de eerste keer zal de api (maximum) 30 seconden nodig hebben om te antwoorden op de eerste requests. Hierna zou alles vlotter moeten lopen.
- wacht ook altijd tot de laadsymbolen weg zijn

### Visuals

#### Tasks:

De naam van een taak kan verschillende kleuren hebben:
- zwart/wit: meer dan 24u
- geel: minder dan 24u
- rood: deadline verlopen

(eventueel) categorienaam
- Ook kleur van border is gelijk aan dat van categorie

Taken hebben icoontjes ((dubbel)pijltje omhoog, plat, (dubbel)pijltje naar beneden)
- beschrijft de prioriteit visueel

Taken kunnen rechts een vertakking-symbool hebben
- betekent dat deze taak een of meerdere subtaken heeft



### Gekende Bugs

VoiceOver:
- wanneer een modal voor de tweede keer geopend wordt zal de pagina unresponsive worden
- eerste keer is alles perfect!

-> enkel bij VoiceOver enabled

## Bronnen

### Algemeen gebruik

Cross Platform Development handboek

PowerPoint presentaties uit de lessen Cross Platform Developement

 [Gemini](https://gemini.google.com/app) (Google)
- gebruikt voor het debuggen van stukken code die niet werkten.

[React Native Docs](https://reactnative.dev/)
- react native componenten

[Google Font icons](https://fonts.google.com/icons)
- icon library

### Specifiek gebruik

[Context](https://react.dev/reference/react/createContext) (React Native Docs)
- gebruikt voor de darkmode

[Statusbar](https://reactnative.dev/docs/statusbar) (React Native Docs)
- gebruikt de statusbar(ios) gelijk te maken met de gekozen theme in de app

[Tab navigation](https://reactnavigation.org/docs/bottom-tab-navigator/) (React Native navigation)

[Stack navigation](https://reactnavigation.org/docs/stack-navigator/) (React Native navigation)

 [Gemini](https://gemini.google.com/app) gebruikt bij het geven van icons aan verschillende icons aan de tabs (Navigator.js):
 ```javascript
tabBarIcon: ({ color, size }) => {
                    let iconName;
        
                    if (route.name === 'Home') {
                      iconName = 'home';
                    } else if (route.name === 'Settings') {
                      iconName = 'settings';
                    }
        
                    return <Icon name={iconName} size={size} color={color} />;
                  },
 ```

 [Gemini](https://gemini.google.com/app) gebruikt bij bepalen of VoiceOver ingeschakeld is:
 - dient om de (op mobile) modalpagina Task te tonen als een normale pagina met VoiceOver enabled
 ```javascript
    const [isVoiceOverEnabled, setIsVoiceOverEnabled] = useState(false);

    useEffect(() => {
      AccessibilityInfo.isScreenReaderEnabled().then((enabled) => setIsVoiceOverEnabled(enabled))
    }, []);
 ```
 [Gemini](https://gemini.google.com/app) gebruikt bij genereren formule om breedte van scherm te bepalen en aantal kolommen uit te rekenen + past live aan bij verranderen schermgrootte:
 ```javascript
    const [columnsNumber, setColumns] = useState(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300))

    useEffect(() => {
        const updateNumColumns = () => {
            setColumns(Math.floor((Dimensions.get('window').width - (Dimensions.get('window').width/300)*30)/300));
        };
    
        updateNumColumns();
    
        const subscription = Dimensions.addEventListener('change', updateNumColumns);
        return () => subscription.remove();
      }, []);
```
[Activity Indicator](https://reactnative.dev/docs/activityindicator) (React Native Docs)
- visuele het fetchen voorstellen

[UseFocusEffect](https://reactnavigation.org/docs/use-focus-effect/) (React Native Navigation)
- bij focus op pagina refresh

[Gemini](https://gemini.google.com/app) gebruikt bij genereren van fetch voor call naar api

[Picker](https://github.com/react-native-picker/picker) (react-native-picker/picker (github))

[Moment](https://momentjs.com/) (String to Date)

[ColorPicker](https://www.npmjs.com/package/react-native-wheel-color-picker) (react-native-wheel-color-picker)
