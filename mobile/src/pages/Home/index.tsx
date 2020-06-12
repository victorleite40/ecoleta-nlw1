import React, { useState, useEffect } from 'react';
import { Feather as Icon } from "@expo/vector-icons";
import { View, ImageBackground, Image, Text, Easing, Animated } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';

import { apiIbge } from '../../services/api';
import styles, { pickerSelectStyles } from './styles';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface UFS {
    label: string, 
    value: string
}

interface Cities {
    label: string, 
    value: string
}

const Home = () => {
    const navigation = useNavigation();

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    // ADDRESS FORM
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    // UF
    useEffect(() => {
        apiIbge.get<IBGEUFResponse[]>('').then(res => {
            setUfs(res.data.map(uf => uf.sigla));
        });
    }, [])

    // CITY
    useEffect(() => {
        if (uf==='') {
            return;
        }

        apiIbge.get<IBGECityResponse[]>(`${uf}/municipios`).then(res => {
            setCities(res.data.map(city => city.nome));
        });
    }, [uf])

    const ufList:UFS[] = [];
    
    ufs.map(uf => {
        ufList.push(
            { label: uf, value: uf },
        )
    });

    const citiesList:Cities[] = [];

    cities.map(city => {
        citiesList.push(
            { label: city, value: city },
        )
    });

    function handleNavigateToPoints() {
        navigation.navigate('Points', { uf, city });
    }

    const [avoidAnim] = useState(new Animated.Value(0))

    function avoidView(opening: boolean) {
        if (opening){
            Animated.timing(avoidAnim, {
                toValue: 250,
                duration: 250,
            }).start();
        } else {
            Animated.timing(avoidAnim, {
                toValue: 0,
                duration: 200
            }).start();
        }
    }

    return (
        <Animated.View style={{ flex: 1, marginBottom: avoidAnim }} >
            <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }} >
                <View style={styles.main} >
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer} >
                    <RNPickerSelect
                        style={pickerSelectStyles}
                        onOpen={() => avoidView(true)}
                        onClose={() => avoidView(false)}
                        onValueChange={(value) => setUf(value)}
                        items={ufList}
                        placeholder={{
                            label: 'Selecione a UF'    
                        }}
                    />
                    <RNPickerSelect
                        style={pickerSelectStyles}
                        onOpen={() => avoidView(true)}
                        onClose={() => avoidView(false)}
                        onValueChange={(value) => setCity(value)}
                        items={citiesList}
                        placeholder={{
                            label: 'Selecione a Cidade'    
                        }}
                    />
                    
                    <RectButton style={styles.button} onPress={handleNavigateToPoints} >
                        <View style={styles.buttonIcon} >
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24} />
                            </Text> 
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </Animated.View>
    );
};

export default Home;