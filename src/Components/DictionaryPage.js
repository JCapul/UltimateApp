import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, SectionList, Modal, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

import I18n from '../utils/i18n';
import theme from '../styles/theme.style';

const screenDimension = Dimensions.get('window');

const DictionaryPage = ({ dictionary }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    id: 0,
    text: '',
    definition: '',
  });

  const _onPressItem = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const _renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() => {
          _onPressItem(item);
        }}
      >
        <Text style={styles.row}>{item.text}</Text>
      </TouchableHighlight>
    );
  };

  const renderSectionHeader = ({ section }) => {
    return <Text style={styles.header}>{section.title}</Text>;
  };

  return (
    <View style={styles.dictionaryPage} width={screenDimension.width}>
      <SectionList
        sections={dictionary}
        renderItem={item => _renderItem(item)}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={({ id }) => id}
      />
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedItem.text}</Text>
            <Text style={styles.modalText}>{selectedItem.definition}</Text>
            <TouchableHighlight
              style={styles.returnButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.returnButtonText}>{I18n.t('shared.back')}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    dictionary: state.theory.dictionary,
  };
};

export default connect(mapStateToProps)(DictionaryPage);

const styles = StyleSheet.create({
  dictionaryPage: {
    backgroundColor: theme.COLOR_PRIMARY_LIGHT,
    paddingTop: 20,
  },
  header: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: theme.COLOR_PRIMARY,
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: theme.COLOR_SECONDARY_LIGHT,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    fontSize: theme.FONT_SIZE_MEDIUM,
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: theme.FONT_SIZE_LARGE,
  },
  returnButton: {
    backgroundColor: theme.COLOR_PRIMARY,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
    width: 120,
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});