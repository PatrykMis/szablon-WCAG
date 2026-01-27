# Reprezentacja złożonych reprezentacji graficznych

W przypadku gdy w publikacji istnieją złożone reprezentacje graficzne, których opis alternatywny może być trudny w redakcji, lub zbyt zawiły dla użytkowników czytników technologii asystujących istnieje możliwość przedstawienia ich zawartości w postaci multimodalnego narzędzia, które pozwala na aktywną eksploracje za pomocą klawiatury pomiędzy poszczególnymi poziomami zależnościami przedstawianymi użytkownikowi. Rozwiązanie to wskazane jest dla grafik prezentujących różnego rodzaju zależności, hierarchię poszczególnych elementów, a także w wypadku potrzeby nadania dodatkowej semantyki redagowanemu opisowi. Informacje Mogą to być informacje w postaci grafów, różnego rodzaju drzew, schematów i zależności pomiędzy nimi, mapy myśli, itd.

Aby zacząć tworzyć taką postać zagnieżdżonej listy należy rozpocząć jej tworzenie od umieszczenia elementu korzenia diagramu wewnątrz znacznika `ul` z wartością **tree** atrybutu role znacznika. Jeśli w naszej publikacji zdecydujemy się na zastosowanie większej ilości tego typu listy to należy pamiętać o zmianie id dla każdej kolejnej listy w tym elemencie `<div id="tfl-deque-tree-root">` oraz każdym atrybucie **data-tree-root**, w którym należy wprowadzić wspomniany identyfikator:

```html
<div class="tfl-deque-tree-no-select tfl-deque-tree tfl-left">
    <div id="tfl-deque-tree-root">
        <ul role="tree">
        <!--Miejsce umieszczenia korzenia wraz z kolejnymi elementami listy reprezentującej diagram-->
        </ul>
    </div>
</div>
```

Następnym krokiem jest zdefiniowanie korzenia grafu. Jeśli korzeń opisywanego diagramu jest jedynym jego elementem to należy w takim przypadku wewnątrz znacznika `ul` umieścić poniższy kod:

```html
<li role="treeitem" aria-label="wartość korzenia" data-tree-root="tfl-deque-tree-root" tabindex="-1" aria-expanded="false">
    <div class="tfl-deque-tree-leaf" aria-hidden="true"></div>
    <span class="tfl-deque-tree-label">wartość korzenia</span>
</li>
```

Jest on odpowiednikiem kodu definiującego liście dla takiego grafu, których sposób tworzenia przedstawiony zostanie w kolejnej części sposobu reprezentacji złożonych reprezentacji graficznych przy użyciu zagnieżdżonych list.  Dla powyższego kodu w atrybucie `aria-level=" "` oraz znaczniku `span` o klasie <strong>tfl-deque-tree-label</strong> autor powinien wpisać wartość wierzchołka opisywanego grafu. Operację tą wykonujemy również na przedstawionych w kolejnych etapach przykładach procesu tworzenia zagnieżdżonych list.

W procesie tworzenia korzenia grafu może wystąpić przypadek, w którym element będący jego korzeniem będzie rodzicem kolejnych elementów opisywanego grafu. W takim wypadku należy pamiętać, że elementy będące dziećmi opisywanego korzenia należy umieścić w znaczniku `ul` z wartością **group** atrybutu role znacznika. Dodatkowo należy nadać znacznikowi div opisu korzenia wartość reprezentującą wartość wierzchołka klasy o nazwie **tfl-deque-tree-branch**.

```html
<li role="treeitem" aria-label="wartość korzenia grafu" data-tree-root="tfl-deque-tree-root" tabindex="-1" aria-expanded="false">
    <div class="tfl-deque-tree-branch" aria-hidden="true"></div>
    <span class="tfl-deque-tree-label">wartość korzenia grafu</span>
    <ul role="group">
        <li role="treeitem" aria-label="wartość wierzchołka grafu" data-tree-root="tfl-deque-tree-root" tabindex="-1" aria-expanded="false">
            <div class="tfl-deque-tree-leaf" aria-hidden="true"></div>
            <span class="tfl-deque-tree-label">wartość wierzchołka grafu</span>
        </li>
        ....
    </ul>
<li>
```

Ostatnim krokiem opisu diagramów przy użyciu zagnieżdżonych listy jest definiowanie kolejnych wierzchołków dla takiego grafu. Odbywa się to w identyczny sposób w jaki tworzyliśmy korzeń. Otóż, jeśli wierzchołek nie posiada dzieci, a co za tym idzie jest liściem takiego grafu to należy opisać go w następujący sposób:

```html
<li role="treeitem" aria-label="wartość liścia grafu" data-tree-root="tfl-deque-tree-root" tabindex="-1" aria-expanded="false">
    <div class="tfl-deque-tree-leaf" aria-hidden="true"></div>
    <span class="tfl-deque-tree-label">wartość liścia grafu</span>
</li>
```

Natomiast jeśli jest rodzicem kolejnych wierzchołków takiego grafu to należy opisać go poniższym kodem wraz z umieszczeniem kolejnych jego elementów (jego dzieci) w znaczniku `ul` listy.

```html
<li role="treeitem" aria-label="wartość rodzica" data-tree-root="tfl-deque-tree-root" tabindex="-1" aria-expanded="false">
    <div class="tfl-deque-tree-branch" aria-hidden="true"></div>
    <span class="tfl-deque-tree-label">wartość rodzica</span>
    <ul role="group">
        <li role="treeitem" aria-label="wartość wierzchołka grafu" data-tree-root="tfl-deque-tree-root" tabindex="-1" aria-expanded="false">
            <div class="tfl-deque-tree-leaf" aria-hidden="true"></div>
            <span class="tfl-deque-tree-label">wartość wierzchołka grafu</span>
        </li>
        ....
    </ul>
<li>
```
