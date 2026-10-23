# El margen de Fermat · Preuniversitario Tesla

Pieza educativa: carrusel de 10 láminas (1080x1350) y reel 9:16 (1080x1920, 70,25 s, calzado con la voz grabada).
Nada se publicó. Los archivos están en esta carpeta.

---

## Texto del post (Instagram y TikTok)

¿Homero Simpson le ganó a uno de los problemas más famosos de la historia?

No. Pero casi engaña a todos.

En el capítulo de Los Simpson donde Homero entra en 3D (especial de Halloween, 1995) aparece 1782¹² + 1841¹² = 1922¹². Una calculadora de 10 dígitos dice que es cierta. No lo es, y se prueba sin calculadora: 1782 es par, 1841 es impar, y par más impar da impar. Pero 1922¹² es par.

La historia detrás: hacia 1637, Pierre de Fermat anotó en el margen de un libro que aⁿ + bⁿ = cⁿ no tiene solución en enteros positivos si n ≥ 3, y que tenía una demostración maravillosa que no cabía ahí. Pasaron 358 años hasta que Andrew Wiles la publicó en 1995.

Al final hay un desafío estilo PAES: ¿cuál trío puede ser un triángulo rectángulo? Responde en los comentarios antes de ver la respuesta.

Guárdalo y compártelo con quien da la PAES.

#PAES #PAES2027 #Matemática #M1 #Pitágoras #Fermat #UltimoTeoremaDeFermat #LosSimpson #DatosCuriosos #Preuniversitario #PreuTesla #EstudiaConmigo #Chile

> Ojo: el emoji de la primera línea es opcional; si la marca no usa emojis en el texto del post, se saca sin tocar nada más.

## Versión corta para historias

¿Homero le ganó a Fermat?
1782¹² + 1841¹² = 1922¹² parece cierta en la calculadora.
Par + impar = impar. 1922¹² es par. Es falsa.
Desliza para el desafío PAES.

---

## Guion de narración del reel (voz)

Tono cercano, para estudiantes de 17 años, español de Chile. Ritmo de unas 145 palabras por minuto.
Las cifras van escritas como se dicen. Las duraciones viven en `video.html`, en el objeto `ESCENAS` (cambiar solo los números `dur`).

| # | Escena (id) | Inicio | Dura | Texto hablado |
|---|---|---|---|---|
| 1 | Gancho: la ecuación de Los Simpson (`e1`) | 0,0 s | 3,8 s | Esta ecuación salió en Los Simpson, y la calculadora dice que es cierta. |
| 2 | ¿Le ganó a Fermat? (`e2`) | 3,8 s | 2,0 s | ¿Homero le ganó a Fermat? |
| 3 | n = 2, Pitágoras (`e3`) | 5,8 s | 5,5 s | Con cuadrados sí funciona: tres, cuatro y cinco. Y hay infinitos tríos así. |
| 4 | n = 3, cubos (`e4`) | 11,3 s | 3,9 s | Con cubos, nunca calza: siempre sobra o falta un cubito. |
| 5 | La nota del margen (`e5`) | 15,2 s | 9,0 s | Hacia mil seiscientos treinta y siete, Fermat anotó en un margen: con potencias mayores que dos, nunca calza. Tenía una prueba maravillosa, pero no le cabía. |
| 6 | Siglos de intentos (`e6`) | 24,2 s | 4,25 s | Fermat probó el cuatro; Euler, el tres. Pero nadie pudo con todos. |
| 7 | Wiles (`e7`) | 28,45 s | 12,85 s | Andrew Wiles lo conoció a los diez años. Lo anunció en mil novecientos noventa y tres, pero tenía un error. Con Richard Taylor lo arregló, y en mil novecientos noventa y cinco quedó publicado: trescientos cincuenta y ocho años después. |
| 8 | De vuelta al 3D: paridad (`e8`) | 41,3 s | 12,1 s | ¿Y Homero? Mil setecientos ochenta y dos es par; mil ochocientos cuarenta y uno, impar. Par más impar da impar, pero mil novecientos veintidós es par. Falsa. Y mira cómo termina cada lado. |
| 9 | Desafío PAES + cuenta regresiva (`e9`) | 53,4 s | 7,9 s | Ahora tú: ¿cuál de estos tríos forma un triángulo rectángulo? Tres segundos. *(silencio de 3 s con la cuenta 3, 2, 1)* |
| 10 | Respuesta (`e10`) | 61,3 s | 4,75 s | La C: ocho al cuadrado más quince al cuadrado da diecisiete al cuadrado. |
| 11 | Cierre (`e11`) | 66,05 s | 4,2 s | Guárdalo y compártelo con quien da la PAES. |

Total: 70,25 s, calzado con `voz/narracion-a.mp3` (66,16 s) más 3,0 s de silencio insertado en el segundo 58,3. La cuenta regresiva parte en el segundo 4,9 de `e9` (58,3 s del video) y dura exactamente 3,0 s. El video sin audio es `preu-fermat-reel-sinvoz.mp4`.

Cómo calzar con el audio real: medir cuánto dura cada frase grabada, poner ese valor (más unos 0,4 s de aire) en `dur` de la escena y volver a grabar con `node ../voltio-video/grabar.mjs video.html preu-fermat-reel.mp4 30 6`. Las animaciones internas de cada escena ocurren dentro de su duración actual; si una escena se acorta mucho, revisar sus `data-t`. Los `data-t` internos siguen los tiempos por palabra de `voz/palabras.json`.

Subtítulos: la franja inferior de 300 px del video queda libre (de 1620 a 1920 px).

---

## Láminas del carrusel

1. Portada: «Una nota en un margen tuvo ocupados a los mejores matemáticos durante 358 años».
2. ¿Homero le ganó a Fermat? La ecuación del capítulo en un mundo 3D propio y la calculadora que dice «iguales».
3. Con n = 2 sí funciona: los cuadritos de los catetos llenan el cuadrado de la hipotenusa (3, 4, 5; 5, 12, 13; 8, 15, 17).
4. Con n = 3 nunca calza: 9³ + 10³ = 1729 y 12³ = 1728 (sobra 1); 6³ + 8³ = 728 y 9³ = 729 (falta 1).
5. La nota del margen (texto latino y traducción). Publicada en 1670 por su hijo Samuel.
6. Siglos de intentos: línea de tiempo de 1637 a 1995.
7. Wiles: 1963, 1993, el error, 1994 con Richard Taylor, 1995; 358 años.
8. La paridad desarma la ecuación de Homero; las cifras finales; la trampa de 1998 cae con el 3.
9. Desafío estilo PAES (M1), sin respuesta.
10. Respuesta C con el porqué de cada alternativa, trampas y cierre.

## Desafío estilo PAES (M1)

¿Cuál de los siguientes tríos de números puede corresponder a las medidas de los lados de un triángulo rectángulo?

- A) 2, 3 y 4
- B) 5, 12 y 14
- C) 8, 15 y 17
- D) 9, 12 y 16

Respuesta: **C**. 8² + 15² = 64 + 225 = 289 = 17².
A: 4 + 9 = 13 y 4² = 16. B: 25 + 144 = 169 y 14² = 196. D: 81 + 144 = 225 y 16² = 256.
Trampas: B se parece a 5, 12 y 13, y D a 9, 12 y 15, que sí son tríos pitagóricos.

---

## Hechos verificados y fuentes

- Nota de Fermat hacia 1637, en el margen de su ejemplar de la *Aritmética* de Diofanto (edición de Bachet de 1621), junto al problema 8 del libro II; se conoció por la edición de su hijo Samuel de 1670. Fuentes: https://proofwiki.org/wiki/Fermat%27s_Last_Theorem/Historical_Note , https://www.lindahall.org/about/news/scientist-of-the-day/pierre-de-fermat/ , texto latino en https://en.wikiquote.org/wiki/Pierre_de_Fermat
- Fermat probó n = 4 por descenso infinito; Euler publicó n = 3 en su *Álgebra* de 1770 (con un vacío que se completa con otros resultados suyos). Fuentes: https://mathshistory.st-andrews.ac.uk/HistTopics/Fermat%27s_last_theorem/ , https://www.math.uci.edu/~ndonalds/math180b/5descent.pdf
- n = 5: Dirichlet y Legendre, 1825. n = 7: Lamé, 1839. Kummer, 1847: primos regulares. Fuente: https://mathshistory.st-andrews.ac.uk/HistTopics/Fermat%27s_last_theorem/
- Wiles: en 1963, a los 10 años, encontró el problema en un libro de la biblioteca; anuncio en Cambridge en junio de 1993; error detectado en 1993; corrección en septiembre de 1994 con ayuda de Richard Taylor; publicado en *Annals of Mathematics* en 1995. 1995 − 1637 = 358. Fuentes: https://www.mathunion.org/fileadmin/IMU/Prizes/Abel/2016/Abelprize_2016_Wiles_bio.pdf , https://en.wikipedia.org/wiki/Wiles%27s_proof_of_Fermat%27s_Last_Theorem
- 1782¹² + 1841¹² = 1922¹² aparece en el segmento en 3D de Homero del especial de Halloween de Los Simpson de 1995 («Treehouse of Horror VI»); 3987¹² + 4365¹² = 4472¹² en «The Wizard of Evergreen Terrace», 1998. Fuente: https://cs.appstate.edu/sjg/simpsonsmath/fermat.html , https://cs.appstate.edu/sjg/futurama/nearmiss.html
- Verificado con Python con enteros exactos:
  - 1782¹² + 1841¹² = 2541210258614589176288669958142428526657; 1922¹² = 2541210259314801410819278649643651567616. Los dos tienen 40 dígitos; coinciden solo los 9 primeros. Con 10 cifras significativas ambos dan 2,541210259 × 10³⁹ y la raíz duodécima del lado izquierdo es 1921,99999995…, que una pantalla de 10 dígitos muestra como 1922. El lado izquierdo es impar (termina en 7) y el derecho es par (termina en 6).
  - 3987¹² + 4365¹² y 4472¹² coinciden en los 10 primeros de 44 dígitos; los dos son pares, pero el izquierdo es múltiplo de 3 (3987 y 4365 lo son) y 4472¹² no (4472 deja resto 2 al dividir por 3).
  - 9³ + 10³ = 1729 y 12³ = 1728; 6³ + 8³ = 728 y 9³ = 729. Tríos 3-4-5, 5-12-13, 8-15-17 y 9-12-15 comprobados.

Derechos: no se usa ninguna imagen, personaje ni captura de Los Simpson; solo se nombra el capítulo y se muestra la ecuación. El mundo 3D, los poliedros y la calculadora son ilustración propia en HTML/SVG.
