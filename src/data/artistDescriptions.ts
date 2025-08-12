export interface ArtistDescription {
  ko: string;
  en: string;
}

export const artistDescriptions: Record<string, ArtistDescription> = {
  Rembrandt: {
    ko: "렘브란트 반 레인(1606-1669)은 네덜란드의 바로크 시대 대표 화가입니다. 극적인 명암법과 심리적 깊이를 표현하는 독특한 스타일로 유명하며, '야경', '자화상' 시리즈, '다나에' 등의 대표작을 통해 인간의 내면과 감정을 깊이 있게 표현했습니다. 그의 작품들은 두꺼운 페인트 레이어와 정교한 빛과 그림자 처리로 깊이감을 효과적으로 표현합니다.",
    en: "Rembrandt van Rijn (1606-1669) was a leading Dutch Baroque painter known for his unique style of dramatic chiaroscuro and psychological depth. His masterpieces like 'The Night Watch', the 'Self-Portrait' series, and 'Danaë' deeply expressed human inner life and emotions. His works effectively express depth through thick paint layers and sophisticated light and shadow treatment.",
  },
  "Johannes Vermeer": {
    ko: "요하네스 페르메이르(1632-1675)는 네덜란드 황금시대의 대표적인 화가입니다. 정밀한 빛의 처리와 평화로운 일상의 아름다움을 그리는 독특한 스타일로 유명하며, '진주 귀걸이를 한 소녀', '우유를 따르는 여인', '지리학자' 등의 대표작을 통해 17세기 네덜란드의 일상생활을 섬세하게 묘사했습니다. 그의 작품들은 카메라 옵스큐라를 활용한 정확한 구도와 빛의 처리가 특징입니다.",
    en: "Johannes Vermeer (1632-1675) was a leading Dutch Golden Age painter known for his unique style of precise light treatment and peaceful beauty of everyday life. His masterpieces like 'Girl with a Pearl Earring', 'The Milkmaid', and 'The Geographer' delicately depicted 17th-century Dutch daily life. His works are characterized by accurate composition using camera obscura and masterful light treatment.",
  },
  "Jean-Honoré Fragonard": {
    ko: "장 오노레 프라고나르(1732-1806)는 프랑스 로코코 시대의 대표적인 화가입니다. 우아하고 장식적인 스타일로 사랑과 쾌락의 주제를 표현하는 독특한 기법으로 유명하며, '그네', '사랑의 편지', '문고리' 등의 대표작을 통해 18세기 프랑스 귀족사회의 우아하고 세련된 문화를 묘사했습니다. 그의 작품들은 섬세한 브러시 워크와 부드러운 색채 전환이 특징입니다.",
    en: "Jean Honoré Fragonard (1732-1806) was a leading French Rococo painter known for his unique technique of expressing themes of love and pleasure through elegant and decorative style. His masterpieces like 'The Swing', 'The Love Letter', and 'The Bolt' depicted the elegant and sophisticated culture of 18th-century French aristocratic society. His works are characterized by delicate brushwork and smooth color transitions.",
  },
  Caravaggio: {
    ko: "미켈란젤로 메리시 다 카라바조(1571-1610)는 이탈리아 바로크 시대의 혁신적인 화가입니다. 극적인 명암법과 사실적인 표현으로 종교적 주제를 현실적으로 그리는 독특한 스타일로 유명하며, '성 마태오의 소명', '다윗과 골리앗', '메두사의 머리' 등의 대표작을 통해 강렬한 감정과 드라마틱한 효과를 표현했습니다.",
    en: "Michelangelo Merisi da Caravaggio (1571-1610) was an innovative Italian Baroque painter known for his unique style of dramatic chiaroscuro and realistic expression of religious subjects. His masterpieces like 'The Calling of Saint Matthew', 'David and Goliath', and 'Medusa' expressed intense emotions and dramatic effects.",
  },
  Titian: {
    ko: "티치아노 베첼리오(1488-1576)는 이탈리아 베네치아 르네상스의 대표적인 화가입니다. 풍부한 색채와 섬세한 빛의 처리가 특징인 독특한 스타일로 유명하며, '베누스와 아도니스', '우르비노의 베누스', '피에타' 등의 대표작을 통해 색채의 마법사라는 별명을 얻었습니다. 그의 작품들은 베네치아 화파의 발전에 지대한 영향을 미쳤습니다.",
    en: "Tiziano Vecellio (1488-1576) was a leading Italian Venetian Renaissance painter known for his unique style characterized by rich colors and delicate light treatment. His masterpieces like 'Venus and Adonis', 'Venus of Urbino', and 'Pietà' earned him the nickname 'Master of Color'. His works had a profound impact on the development of the Venetian school.",
  },
  "Peter Paul Rubens": {
    ko: "피터 파울 루벤스(1577-1640)는 플랑드르 바로크 시대의 대표적인 화가입니다. 역동적인 구도와 풍부한 색채로 신화적, 종교적 주제를 표현하는 독특한 스타일로 유명하며, '삼현왕의 경배', '레우카디아와 클레오파트라', '미네르바가 아라크네를 벌하는 장면' 등의 대표작을 통해 바로크 예술의 정점을 보여주었습니다.",
    en: "Peter Paul Rubens (1577-1640) was a leading Flemish Baroque painter known for his unique style of dynamic composition and rich colors expressing mythological and religious subjects. His masterpieces like 'The Adoration of the Magi', 'Leucadia and Cleopatra', and 'Minerva Punishing Arachne' demonstrated the pinnacle of Baroque art.",
  },
  "Édouard Manet": {
    ko: "에두아르 마네(1832-1883)는 프랑스 인상주의의 선구자입니다. 현대적 주제와 혁신적인 기법으로 전통적 아카데미즘에 도전한 독특한 스타일로 유명하며, '올랭피아', '풀밭 위의 점심', '바를의 폴레르베르제' 등의 대표작을 통해 현대 미술의 새로운 방향을 제시했습니다.",
    en: "Édouard Manet (1832-1883) was a pioneer of French Impressionism known for his unique style challenging traditional academicism with modern subjects and innovative techniques. His masterpieces like 'Olympia', 'Luncheon on the Grass', and 'A Bar at the Folies-Bergère' suggested new directions for modern art.",
  },
  "Gustave Courbet": {
    ko: "귀스타브 쿠르베(1819-1877)는 프랑스 사실주의의 대표적인 화가입니다. 현실을 있는 그대로 그리는 사실적 기법과 사회적 주제를 다루는 독특한 스타일로 유명하며, '돌 깨는 사람들', '오르낭의 장례식', '화가의 아틀리에' 등의 대표작을 통해 사회적 현실을 직시하는 예술을 추구했습니다.",
    en: "Gustave Courbet (1819-1877) was a leading French Realist painter known for his unique style of realistic technique depicting reality as it is and dealing with social subjects. His masterpieces like 'The Stone Breakers', 'A Burial at Ornans', and 'The Artist's Studio' pursued art that directly faced social reality.",
  },
  "Vincent van Gogh": {
    ko: "빈센트 반 고흐(1853-1890)는 네덜란드 출신의 후기 인상주의 화가입니다. 강렬한 색채와 두꺼운 브러시 스트로크로 감정을 표현하는 독특한 스타일로 유명하며, '별이 빛나는 밤', '해바라기', '자화상' 등의 대표작을 통해 예술계에 혁신적인 기여를 했습니다. 그의 작품들은 현대 미술의 발전에 지대한 영향을 미쳤으며, 오늘날까지 많은 사람들에게 영감을 주고 있습니다.",
    en: "Vincent van Gogh (1853-1890) was a Dutch post-impressionist painter known for his unique style using intense colors and thick brushstrokes to express emotion. His masterpieces like 'The Starry Night', 'Sunflowers', and 'Self-Portraits' made revolutionary contributions to the art world. His works have had a profound impact on the development of modern art and continue to inspire people today.",
  },
  "Edgar Degas": {
    ko: "에드가 드가(1834-1917)는 프랑스 인상주의의 대표적인 화가입니다. 발레리나와 말을 주제로 한 독특한 구도와 섬세한 관찰력이 특징인 스타일로 유명하며, '발레 수업', '무대의 발레리나들', '말 경주' 등의 대표작을 통해 움직임과 순간의 아름다움을 포착했습니다.",
    en: "Edgar Degas (1834-1917) was a leading French Impressionist painter known for his style characterized by unique compositions of ballerinas and horses and delicate observation. His masterpieces like 'The Ballet Class', 'The Ballet Dancers on Stage', and 'Horse Racing' captured the beauty of movement and moments.",
  },
  "Paul Cézanne": {
    ko: "폴 세잔(1839-1906)은 프랑스 후기 인상주의의 대표적인 화가입니다. 기하학적 형태와 색채의 구조적 분석으로 현대 미술의 기초를 마련한 독특한 스타일로 유명하며, '생 빅투아르 산', '사과가 있는 정물화', '카드놀이하는 사람들' 등의 대표작을 통해 입체주의의 선구자가 되었습니다.",
    en: "Paul Cézanne (1839-1906) was a leading French Post-Impressionist painter known for his unique style of geometric forms and structural analysis of color that laid the foundation for modern art. His masterpieces like 'Mont Sainte-Victoire', 'Still Life with Apples', and 'The Card Players' became a pioneer of Cubism.",
  },
  "Henri de Toulouse-Lautrec": {
    ko: "앙리 드 툴루즈 로트렉(1864-1901)은 프랑스의 독특한 화가입니다. 몽마르트의 밤문화와 카바레를 주제로 한 독특한 스타일로 유명하며, '물랭 루주에서', '라 굴뤼', '제인 아브릴' 등의 대표작을 통해 19세기 말 파리의 보헤미안 문화를 생생하게 묘사했습니다.",
    en: "Henri de Toulouse-Lautrec (1864-1901) was a unique French painter known for his distinctive style focusing on Montmartre's nightlife and cabarets. His masterpieces like 'At the Moulin Rouge', 'La Goulue', and 'Jane Avril' vividly depicted the bohemian culture of late 19th-century Paris.",
  },
  "Jean-Auguste-Dominique Ingres": {
    ko: "장 오귀스트 도미니크 앵그르(1780-1867)는 프랑스 신고전주의의 대표적인 화가입니다. 정밀한 선과 이상적인 아름다움을 추구하는 독특한 스타일로 유명하며, '오달리스크', '나폴레옹 1세의 황제 초상', '터키 목욕탕' 등의 대표작을 통해 고전적 완벽함을 추구했습니다.",
    en: "Jean-Auguste-Dominique Ingres (1780-1867) was a leading French Neoclassical painter known for his unique style pursuing precise lines and ideal beauty. His masterpieces like 'The Grand Odalisque', 'Napoleon I on His Imperial Throne', and 'The Turkish Bath' pursued classical perfection.",
  },
  "Francisco Goya": {
    ko: "프란시스코 고야(1746-1828)는 스페인의 대표적인 화가입니다. 사회적 비판과 인간의 어두운 면을 표현하는 독특한 스타일로 유명하며, '마야의 옷을 벗은 모습', '1808년 5월 3일', '검은 그림들' 등의 대표작을 통해 인간의 본질과 사회적 현실을 깊이 있게 탐구했습니다.",
    en: "Francisco Goya (1746-1828) was a leading Spanish painter known for his unique style expressing social criticism and the dark side of humanity. His masterpieces like 'The Naked Maja', 'The Third of May 1808', and 'The Black Paintings' deeply explored human nature and social reality.",
  },
  "Pierre-Auguste Renoir": {
    ko: "피에르 오귀스트 르누아르(1841-1919)는 프랑스 인상주의의 대표적인 화가입니다. 따뜻한 색채와 부드러운 브러시 워크로 일상의 아름다움을 표현하는 독특한 스타일로 유명하며, '물랭 드 라 갈레트', '피아노 치는 소녀들', '우산' 등의 대표작을 통해 인상주의의 따뜻한 면을 보여주었습니다.",
    en: "Pierre-Auguste Renoir (1841-1919) was a leading French Impressionist painter known for his unique style expressing the beauty of everyday life with warm colors and soft brushwork. His masterpieces like 'Dance at Le Moulin de la Galette', 'Girls at the Piano', and 'The Umbrellas' showed the warm side of Impressionism.",
  },
  "Berthe Morisot": {
    ko: "베르트 모리조(1841-1895)는 프랑스 인상주의의 대표적인 여성 화가입니다. 섬세한 색채와 부드러운 빛의 처리가 특징인 독특한 스타일로 유명하며, '요람', '베르지', '여성과 아이' 등의 대표작을 통해 여성의 일상과 가족의 따뜻함을 표현했습니다.",
    en: "Berthe Morisot (1841-1895) was a leading French Impressionist female painter known for her unique style characterized by delicate colors and soft light treatment. Her masterpieces like 'The Cradle', 'The Harbor at Lorient', and 'Woman and Child' expressed women's daily life and family warmth.",
  },
  "Katsushika Hokusai": {
    ko: "가쓰시카 호쿠사이(1760-1849)는 일본 에도 시대의 대표적인 우키요에 화가입니다. 정밀한 선과 독특한 구도로 일본의 자연과 문화를 표현하는 스타일로 유명하며, '가나가와 해변의 높은 파도', '후지산 36경', '만화' 등의 대표작을 통해 일본 예술의 정수를 보여주었습니다.",
    en: "Katsushika Hokusai (1760-1849) was a leading Japanese Ukiyo-e painter of the Edo period known for his style expressing Japan's nature and culture with precise lines and unique composition. His masterpieces like 'The Great Wave off Kanagawa', 'Thirty-Six Views of Mount Fuji', and 'Manga' showed the essence of Japanese art.",
  },

  "Auguste Rodin": {
    ko: "오귀스트 로댕(1840-1917)은 프랑스의 대표적인 조각가입니다. 감정과 움직임을 표현하는 독특한 조각 기법으로 유명하며, '생각하는 사람', '지옥의 문', '칼레의 시민들' 등의 대표작을 통해 현대 조각의 새로운 방향을 제시했습니다.",
    en: "Auguste Rodin (1840-1917) was a leading French sculptor known for his unique sculptural technique expressing emotion and movement. His masterpieces like 'The Thinker', 'The Gates of Hell', and 'The Burghers of Calais' suggested new directions for modern sculpture.",
  },
};
